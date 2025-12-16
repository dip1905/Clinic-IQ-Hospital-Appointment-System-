const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: String,
  qualification: String,
  experience: Number,
  consultationFee: Number,
  availableDays: [String],
  availableTime: {
    from: String,
    to: String
  }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
