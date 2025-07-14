import express from 'express';
import multer from 'multer';
import Attachment from '../models/attachment.js';

const router = express.Router();
const upload = multer();

router.post('/upload', upload.single('file'), async(req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({ error: 'Файл не загружен' });
        }

        const attachment = await Attachment.create({
            file_name: req.file.originalname,
            file_data: req.file.buffer,
            mime_type: req.file.mimetype,
            size: req.file.size
        });
        res.json({ id: attachment.id, file_name: attachment.file_name })
    } catch (error) {
        console.error('Ошибка загрузки:', error)
        res.status(500).json({ error: 'Ошибка сервера при загрузке файла' })
    }
});

router.get('/download/:id', async(req, res) => {
    try {
        const attachment = await Attachment.findByPk(req.params.id);
        if(!attachment) {
            return res.status(400).json({ error: 'Файл не найден' });
        }
        res.setHeader('Content-type', attachment.mime_type ||
            'application/octet-stream');
        res.setHeader('Content-disposition', `attachment; file_name="${attachment.file_name}"`);
        res.send(attachment.file_data);
    } catch (error) {
        console.error('Ошибка скачивания', error);
        res.status(500).json({ error: 'Ошибка сервера при скачивании файла' })
    }
});

router.get('/', async(req, res) => {
    try {
        const files = await Attachment.findAll({
            attributes: ['id', 'file_name', 'file_data', 'mime_type', 'size', 'created_at'],
            order: [['created_at', 'DESC']]
        });
        res.json(files);
    } catch (error) {
        console.error('Ошибка загрузки списка', error);
        res.status(500).json({ error: 'Ошибка сервера при получении списка' })
    }
})

export default router;