const appointmentService = require('../services/appointmentService.js')

const appointmentController = {
    async getByMonth(req, res) {
        try {
            const { year, month } = req.query;
            const result = await appointmentService.getAllByMonth(Number(year), Number(month));
            res.json(result);
        } catch (error) {
            console.error("Ошибка получения записей:", error);
            res.status(500).json({ error: "Ошибка сервера при получении записей" });
        }
    },

    async create(req, res) {
        try {
            const result = await appointmentService.create(req.body);
            res.status(201).json(result);
        } catch (e) {
            res.status(400).json({ error: e.message }); 
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const result = await appointmentService.update(id, req.body);
            res.status(201).json(result);
        } catch (e) {
            if (e.message && (
                e.message.includes('обязательно') ||
                e.message.includes('уже есть запись')
            )) {
                res.status(400).json({ error: e.message });
            } else {
                console.error("Ошибка обновления записи:", e);
                res.status(500).json({ error: "Ошибка сервера при обновлении записи" });
            }
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;
            const result = await appointmentService.delete(id);
            res.sendStatus(204);
        } catch (e) {
            if (e.message && e.message.includes('не указан')) {
                res.status(400).json({ error: e.message });
            } else {
                console.error("Ошибка удаления записи:", e);
                res.status(500).json({ error: "Ошибка сервера при удалении записи" });
            }
        }
    }
};

module.exports = appointmentController;
