import express from 'express';
import multer from 'multer';
import PortfolioImage from '../models/portfolio.js';
import pkg from 'easy-yandex-s3';
const { EasyYandexS3 } = pkg;

const router = express.Router();
const upload = multer();

// Инициализация клиента Яндекс Облака
const S3 = new EasyYandexS3({
  auth: {
    accessKeyId: process.env.YANDEX_ACCESS_KEY,
    secretAccessKey: process.env.YANDEX_SECRET_KEY,
  },
  Bucket: process.env.YANDEX_BUCKET_NAME,
  debug: true,
});

// POST /api/portfolio-images/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }

    // Загружаем файл в бакет, можно указать папку например 'portfolio/'
    const result = await S3.Upload({
        buffer: req.file.buffer,
        name: req.file.originalname,
    }, 'portfolio/');


    const portfolioImage = await PortfolioImage.create({
        file_name: req.file.originalname,
        file_url: result.Location, 
        mime_type: req.file.mimetype,
        size: req.file.size,
    });

    res.json(portfolioImage);
  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
    res.status(500).json({ error: 'Ошибка сервера при загрузке файла' });
  }
});


router.get('/', async (req, res) => {
  try {
    const images = await PortfolioImage.findAll({
        
        order: [['created_at', 'DESC']],
        attributes: ['id', 'file_name', 'file_url', 'mime_type', 'size', 'created_at'],
    });
    res.json(images);
  } catch (error) {
    console.error('Ошибка получения списка изображений:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении списка' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const image = await PortfolioImage.findByPk(id);
    if (!image) {
      return res.status(404).json({ error: 'Изображение не найдено' });
    }


    const filePath = new URL(image.file_url).pathname.substring(1);
    await S3.Remove(filePath);

    await image.destroy();

    res.json({ message: 'Изображение успешно удалено' });
  } catch (error) {
    console.error('Ошибка удаления изображения:', error);
    res.status(500).json({ error: 'Ошибка сервера при удалении изображения' });
  }
});

export default router;
