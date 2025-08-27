import express from 'express';
import cors from 'cors';
import notesRouter from './routes/notes.js';
import appointmentRouter from './routes/appointments.js';
import attachmentRouter from './routes/attachments.js';
import portfolioImagesRouter from './routes/portfolioImages.js';
import sequelize from './config/sequelize.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json())

app.use('/notes', notesRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/attachments', attachmentRouter);
app.use('/api/portfolio-images', portfolioImagesRouter);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Соединение с БД успешно установлено');

    await sequelize.sync();
    console.log('Таблицы синхронизированы');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Ошибка при подключении к БД:', error);
  }
})();