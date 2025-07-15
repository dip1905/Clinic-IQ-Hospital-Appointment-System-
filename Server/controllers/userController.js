const User = require('../models/User');

const getUsersByRole = async (req, res) => {
  try {
    const role = req.query.role;
    const users = await User.find({ role });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUsersByRole };
