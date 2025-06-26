const Appointment = require('../models/appointment.js');

const appointmentService = {
    async getAllByMonth(year, month) {
        return await Appointment.getAllByMonth(year, month);
    },

    async create(data) {
        
    }
}

module.exports = appointmentService;