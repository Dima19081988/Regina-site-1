import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import pkg from 'easy-yandex-s3';
import sequelize from '../config/sequelize.js';
import PortfolioImage from '../models/portfolioImage.js';
import Category from '../models/portfolioCategory.js';
import { Category, PortfolioImage } from './models/portfolioassociations.js'; 
import authMiddleware from '../middleware/authMiddleware.js'; 
import { assert, error } from 'console';

const router = express.Router();
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Недопустимый тип файла. Разрешены только изображения.'), false);
    }
  }
});

const EasyYandexS3 = pkg.default;
const S3 = new EasyYandexS3({
  auth: {
    accessKeyId: process.env.YANDEX_ACCESS_KEY,
    secretAccessKey: process.env.YANDEX_SECRET_KEY,
  },
  Bucket: process.env.YANDEX_BUCKET_NAME,
  debug: false,
});

const deleteImageFromS3 = async (fileKey) => {
  try {
    await S3.delete(fileKey);
    return true;
  } catch (error) {
    console.error('Ошибка удаления файла из S3:', error);
    return false;
  }
}

// ==================== Categories CRUD ====================
router.post('/categories', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, description } = req.body;

    if (!name) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Название категории обязательно' })
    }

    const category = await Category.create({
      name,
      description: description || null
    }, { transaction });

    await transaction.commit();
    res.status(201).json(category);
  } catch (error) {
    await transaction.rollback();
    console.error('Ошибка создания категории:', error);
    res.status(500).json({ error: 'Ошибка сервера при создании категории' });
  }
});

router.get('/categories', async (req, res) => {
    try {
      const categories = await Category.findAll({
        include: {
          model: PortfolioImage,
          as: 'images',
          attributes: ['id', 'file_url', 'title', 'description', 'created_at'],
        },
        order: [['created_at', 'DESC']]
      })
      res.json(categories);
    } catch (error) {
        console.error('Ошибка получения категорий:', error);
        res.status(500).json({ error: 'Ошибка сервера при получении категорий' });
    }
});

router.delete('/categories/:id', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
    try {
      const category = await Category.findByPk(req.params.id, {
        include: [{
          model: PortfolioImage,
          as: 'images'
      }],
        transaction
      });

      if (!category) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Категория не найдена' });
      }

      for (const image of category.images) {
        await deleteImageFromS3(image.file_key)

      }

      await Category.destroy({
        where: { id: req.params.id },
        transaction
      })

      await transaction.commit();
      res.json({ message: 'Категория и изображения удалены' })
    } catch (error) {
        await transaction.rollback();
        console.error('Ошибка удаления категории:', error);
        res.status(500).json({ error: 'Ошибка удаления категории' });
    }
});

// Обновление категории
router.patch('/categories/:id', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Не найдено' });
    }

    const [updated] = await Category.update(req.body, {
      where: { id: req.params.id },
      transaction
    });
    await transaction.commit();
    res.json(updated);
  } catch (error) {
    await transaction.rollback();
    console.error('Ошибка обновления категории:', error);
    res.status(500).json({ error: 'Ошибка обновления' });
  }
});

// ==================== Image CRUD =======================
router.post('/upload', upload.single('file'), authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();

  let fileKey = null;

  try {

    const { categoryId, title, description } = req.body;
    if (!req.file) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Файл не загружен' });
    }
    if (!categoryId) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Нет указания категории' });
    }

    const category = await Category.findByPk(categoryId, { transaction });
    if (!category) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Категория не найдена' });
    }

    const fileExtension = path.extname(req.file.originalname);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    fileKey = `portfolio/${categoryId}/${uniqueFileName}`;

    const result = await S3.Upload({
        buffer: req.file.buffer,
        name: fileKey,
    }, '/');

    if (!result || !result.Location) {
      throw new Error('Ошибка загрузки файла в облачное хранилище');
    }

    const portfolioImage = await PortfolioImage.create({
        title: title || req.file.originalname,
        description: description || null,
        category_id: categoryId,
        file_name: uniqueFileName,
        file_key: fileKey,
        file_url: result.Location, 
        mime_type: req.file.mimetype,
        size: req.file.size,
    }, { transaction });

    await transaction.commit();
    res.status(201).json(portfolioImage);
  } catch (error) {
    await transaction.rollback();
    
    // Если файл был загружен в S3, но произошла ошибка при сохранении в БД,
    // удаляем файл из S3
    if (fileKey) {
      try {
        await S3.Delete(fileKey);
      } catch (deleteError) {
        console.error('Ошибка при удалении файла из S3 после неудачной загрузки:', deleteError);
      }
    }
    
    console.error('Ошибка загрузки файла:', error);
    
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Размер файла превышает 10MB' });
      }
    }
    res.status(500).json({ error: 'Ошибка сервера при загрузке файла' });
  }
});

router.get('/images', async (req, res) => {
  try {
    const images = await PortfolioImage.findAll({
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
      order: [['created_at', 'DESC']]
    });
    res.json(images);
  } catch (error) {
    console.error('Ошибка получения списка изображений:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении списка' });
  }
});

router.get('/images/:id', async (req, res) => {
  try {
    const image = await PortfolioImage.findByPk(req.params.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    })

    if (!image) {
      return res.status(404).json({ error: 'Изображение не найдено' });
    }
    res.json(image);
  } catch (error) {
    console.error('Ошибка получения изображения:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении изображения' });
  }
});

router.delete('/images/:id', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const image = await PortfolioImage.findByPk(req.params.id, { transaction });
    
    if (!image) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Изображение не найдено' });
    }

    const deleteSuccess = await deleteImageFromS3(image.file_key);

    if (!deleteSuccess) {
      await transaction.rollback();
      return res.status(500).json({ error: 'Ошибка удаления файла из хранилища' });
    }

    await PortfolioImage.destroy({
      where: { id: req.params.id },
      transaction
    });

    await transaction.commit();
    res.json({ message: 'Изображение успешно удалено' });
  } catch (error) {
    await transaction.rollback();
    console.error('Ошибка удаления изображения:', error);
    res.status(500).json({ error: 'Ошибка сервера при удалении изображения' });
  }
});

router.patch('/images/:id', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { title, description } = req.body;
    const image = await PortfolioImage.findByPk(req.params.id, { transaction });

    if (!image) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Изображение не найдено' });
    }

    await PortfolioImage.update(
      { title, description },
      {
        where: { id: req.params.id },
        transaction
      }
    );

    await transaction.commit();
    res.json({ message: 'Изображение успешно обновлено' });
  } catch (error) {
    await transaction.rollback();
    console.error('Ошибка обновления изображения:', error);
    res.status(500).json({ error: 'Ошибка сервера при обновления изображения' });
  }
});


export default router;
