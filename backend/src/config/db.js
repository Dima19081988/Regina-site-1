import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

console.log('DB Config:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD ? '***' : 'NOT SET',
  port: process.env.DB_PORT
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD, // Убедись, что это строка
  port: parseInt(process.env.DB_PORT) || 5432,
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => {
    console.error('Connection error', err.stack);
    console.error('Environment variables:', {
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD ? 'SET' : 'NOT SET',
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_NAME: process.env.DB_NAME
    });
  });
  
export default pool;