const pool = require('../config/db.js');

const Note = {
    async getAll() {
        const result = await pool.query('SELECT * FROM notes ORDER BY created_at DESC');
        return result.rows;
    },

    async getById(id) {
        const result = await pool.query('SELECT * FROM notes WHERE id = $1', [id]);
        return result.rows[0];
    },

    async create({ title, content }) {
        const result = await pool.query(
            'INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *',
            [title, content]
        );
        return result.rows[0];
    },

    async update(id, { title, content }) {
        const result = await pool.query(
            'UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *',
            [title, content, id]
        );
        return result.rows[0];
    },

    async delete(id) {
        await pool.query('DELETE FROM notes WHERE id = $1', [id]);
    }
};

module.exports = Note;