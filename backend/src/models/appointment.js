import pool from '../config/db.js';

const Appointment = {
    async getAllByMonth(year, month) {
        const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
        const endMonth = month + 2;
        const end = endMonth > 12 
            ? `${year + 1}-01-01`
            : `${year}-${String(endMonth).padStart(2, '0')}-01`;
        const result = await pool.query(
            `SELECT 
                id,
                clientname AS "clientName",
                service,
                time,
                price,
                comment,
                date AS date
            FROM appointments
            WHERE date >= $1 AND date < $2
            ORDER BY date, time`,
            [start, end]
        );
        return result.rows;
    },

    async create({ clientName, service, time, price, comment, date }) {
        const result = await pool.query(
            `INSERT INTO appointments (clientname, service, time, price, comment, date) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING 
                id,
                clientname AS "clientName",
                service,
                time,
                price,
                comment,
                date AS date`,
            [clientName, service, time, price, comment, date]
        );
        return result.rows[0];
    },

    async update(id, { clientName, service, time, price, comment, date }) {
const result = await pool.query(
      `UPDATE appointments 
       SET clientname = $1, service = $2, time = $3, price = $4, comment = $5, date = $6 
       WHERE id = $7
       RETURNING 
         id,
         clientname AS "clientName",
         service,
         time,
         price,
         comment,
         date AS date`,
      [clientName, service, time, price, comment, date, id]
    );
        return result.rows[0]
    },

    async delete(id) {
        await pool.query(
            `DELETE FROM appointments WHERE id = $1`, [id]
        ); 
    },

    async findByDateAndTime(date, time) {
    const result = await pool.query(
        `SELECT 
            id,
            clientname AS "clientName",
            service,
            time,
            price,
            comment,
            date AS date
        FROM appointments 
        WHERE date = $1 AND time = $2`,
        [date, time]
    );
        return result.rows[0];
    },
};

export default Appointment;