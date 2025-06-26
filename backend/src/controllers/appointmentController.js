const appointmentService = require('../services/appointmentService.js')

const appointmentController = {
    async getByMonth(req, res) {
        try {
            const { year, month } = req.query;
            const result = await Appointment.getAllByMonth(Number(year), Number(month));
            res.json(result);
        } catch (error) {
            console.error("Ошибка получения записей:", error);
            res.status(500).json({ error: "Ошибка сервера при получении записей" });
        }
    },

    async create(req, res) {
        try {
            const result = await Appointment.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            console.error("Ошибка создания записи:", error);
            res.status(500).json({ error: "Ошибка сервера при создании записи" });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const result = await Appointment.update(id, req.body);
            res.status(201).json(result);
        } catch (error) {
            console.error("Ошибка редактирования записи:", error);
            res.status(500).json({ error: "Ошибка сервера при редактировании записи" });
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;
            const result = await Appointment.delete(id);
            res.sendStatus(204);
        } catch (error) {
            console.error("Ошибка удаления записи:", error);
            res.status(500).json({ error: "Ошибка сервера при удалении записи" });
        }
    }
};

module.exports = appointmentController;
