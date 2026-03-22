const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, trim: true, unique: true, lowercase: true },
  mobile:   { type: Number, required: true },
  username: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['doctor', 'patient', 'admin'],
    default: 'patient',
  },
  isApproved: { type: Boolean, default: false },
  isBlocked:  { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
