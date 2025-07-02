const Appointment = require('../models/appointment.js');

const appointmentService = {
    async getAllByMonth(year, month) {
        return await Appointment.getAllByMonth(year, month);
    },

    async create(data) {
        const { clientName, time, date, service, price, comment } = data;
        
        if(!clientName || !clientName.trim()) throw new Error('Имя обязательно к заполнению');
        if(!time) throw new Error('Время обязательно к заполнению');
        if (!/^\d{2}:\d{2}$/.test(time)) throw new Error('Время должно быть в формате HH:mm');
        if (!date) throw new Error('Дата обязательна к заполнению');
        if (!/^\d{2}:\d{2}$/.test(time)) throw new Error('Время должно быть в формате HH:mm');
        const existing = await Appointment.findByDateAndTime(date, time);
        if(existing) throw new Error('На это время уже есть запись');

        return await Appointment.create({ clientName, time, date, service, price, comment });
    },

    async update(id, data) {
        if (!id) throw new Error('ID записи не указан');
        const { clientName, time, date, service, price, comment } = data;

        if (!clientName || !clientName.trim()) throw new Error('Имя клиента обязательно');
        if (!time) throw new Error('Время обязательно');
        if (!date) throw new Error('Дата обязательна');
        if (!/^\d{2}:\d{2}$/.test(time)) throw new Error('Время должно быть в формате HH:mm');
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Дата должна быть в формате YYYY-MM-DD');

        const existing = await Appointment.findByDateAndTime(date, time);
        if (existing && existing.id !== parseInt(id)) {
            throw new Error('На это время уже есть запись!');
        }

        return await Appointment.update(id, { clientName, service, time, price, comment, date });
    },

    async delete(id) {
        if (!id) throw new Error('ID записи не указан');
        await Appointment.delete(id);
    }
}

module.exports = appointmentService;