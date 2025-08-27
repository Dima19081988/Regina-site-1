import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import pkg from 'easy-yandex-s3';
import sequelize from '../config/sequelize.js';
import PortfolioImage from '../models/portfolioImage.js';
import Category from '../models/portfolioCategory.js';
import { or } from 'sequelize';

const router = express.Router();
const upload = multer();
const EasyYandexS3 = pkg.default;

const S3 = new EasyYandexS3({
  auth: {
    accessKeyId: process.env.YANDEX_ACCESS_KEY,
    secretAccessKey: process.env.YANDEX_SECRET_KEY,
  },
  Bucket: process.env.YANDEX_BUCKET_NAME,
  debug: true,
});
// ==================== Categories CRUD ====================
router.post('/categories', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, description } = req.body;
    if (!name) {
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
          order: [["created_at", "DESC"]]
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
        include: [PortfolioImage],
        transaction
      });

      if (!category) {
        return res.status(404).json({ error: 'Категория не найдена' });
      }

      for (const image of category.images) {
        const filePath = new URL(image.file_url).pathname.substring(1);
        await S3.Delete(filePath);
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
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Не найдено' });
    
    const [updated] = await Category.update(req.body, {
      where: { id: req.params.id },
      returning: true
    });
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления' });
  }
});

// ==================== Image Upload =======================
router.post('/upload', upload.single('file'), authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {

    const { categoryId, title, description } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }
    if (!categoryId) {
      return res.status(400).json({ error: 'Нет указания категории' });
    }

    const category = await Category.findByPk(categoryId, { transaction });
    if (!category) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Недопустимый тип файла' });
    }

    const fileExtension = path.extname(req.file.originalname);
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;

    const result = await S3.Upload({
        buffer: req.file.buffer,
        name: `portfolio/${categoryId}/${uniqueFileName}`,
    }, '/');


    const portfolioImage = await PortfolioImage.create({
        title: title || `Изображение ${Date.now()}`,
        description: description || null,
        category_id: categoryId,
        file_name: uniqueFileName,
        file_url: result.Location, 
        mime_type: req.file.mimetype,
        size: req.file.size,
    }, { transaction });

    await transaction.commit();
    res.status(201).json(portfolioImage);
  } catch (error) {
    await transaction.rollback();
    console.error('Ошибка загрузки файла:', error);
    res.status(500).json({ error: 'Ошибка сервера при загрузке файла' });
  }
});

// ==================== Image Management ====================

router.get('/', async (req, res) => {
  try {
    const { categoryId } = req.query;
    
    const whereClause = categoryId ? { category_id: categoryId } : {};
    const images = await PortfolioImage.findAll({
      where: whereClause,
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      },
      order: [['created_at', 'DESC']]
    });
    res.json(images);
  } catch (error) {
    console.error('Ошибка получения списка изображений:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении списка' });
  }
});


router.delete('/:id', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const image = await PortfolioImage.findByPk(req.params.id, { transaction });
    if (!image) {
      return res.status(404).json({ error: 'Изображение не найдено' });
    }


    const filePath = new URL(image.file_url).pathname.substring(1);
    await S3.Delete(filePath);

    await image.destroy();
    await transaction.commit();
    res.json({ message: 'Изображение успешно удалено' });
  } catch (error) {
    await transaction.rollback();
    console.error('Ошибка удаления изображения:', error);
    res.status(500).json({ error: 'Ошибка сервера при удалении изображения' });
  }
});

export default router;
