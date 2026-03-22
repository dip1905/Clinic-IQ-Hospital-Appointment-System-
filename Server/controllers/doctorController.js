const Doctor = require('../models/Doctor');

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('user', 'name email username isApproved isBlocked');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
