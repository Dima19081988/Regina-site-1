import './models/portfolioAssociations.js'; // ПЕРВЫЙ ИМПОРТ - ОЧЕНЬ ВАЖНО!
import express from 'express';
import cors from 'cors';
import notesRouter from './routes/notes.js';
import appointmentRouter from './routes/appointments.js';
import attachmentRouter from './routes/attachments.js';
import portfolioRouter from './routes/portfolioImages.js';
import sequelize from './config/sequelize.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Настройка CORS (только один раз, до всех маршрутов)
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Регистрация маршрутов
app.use('/notes', notesRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/attachments', attachmentRouter);
app.use('/api/portfolio', portfolioRouter);

// Обработка несуществующих маршрутов (должен быть ПОСЛЕ всех маршрутов)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Глобальная обработка ошибок (должен быть ПОСЛЕ обработчика 404)
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal server error' });
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Соединение с БД успешно установлено');

    await sequelize.sync({ alter: true });
    console.log('Таблицы синхронизированы');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Ошибка при подключении к БД:', error);
  }
})();