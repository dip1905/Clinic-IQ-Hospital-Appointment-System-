const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: Number,
  username: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['doctor', 'patient'],
  }
});

module.exports = mongoose.model('User', UserSchema);
