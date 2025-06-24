const express = require('express');
const cors = require('cors');
const notesRouter = require('./routes/notes');

const app = express();

app.use(cors());
app.use(express.json())

app.use('/notes', notesRouter);

// тестовый
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ serverTime: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
