const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",        
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",       
    required: true
  },
  date: Date,
  status: {
    type: String,
    enum: ['booked', 'cancelled', 'completed'],
    default: 'booked'
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
