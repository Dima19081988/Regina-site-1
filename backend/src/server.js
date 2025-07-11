import express from 'express';
import cors from 'cors';
import notesRouter from './routes/notes.js';
import appointmentRouter from './routes/appointments.js';
import attachmentRouter from './routes/attachments.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json())

app.use('/notes', notesRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/attachments', attachmentRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server error:', err.message);
});



