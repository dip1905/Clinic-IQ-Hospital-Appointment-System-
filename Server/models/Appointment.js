const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: String,
  doctor: String,
  date: Date,
  status: {
    type: String,
    enum: ['booked', 'cancelled', 'completed'],
    default: 'booked'
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
