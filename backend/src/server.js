const express = require('express');
const cors = require('cors');
const notesRouter = require('./routes/notes.js');
const appointmentRouter = require('./routes/appointments.js');

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server error:', err.message);
});


// тестовый
// app.get('/test-db', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT NOW()');
//     res.json({ serverTime: result.rows[0].now });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

