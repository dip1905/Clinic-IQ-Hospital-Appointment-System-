const User = require('../models/User');

exports.getUsersByRole = async (req, res) => {
  try {
    const role = req.query.role;
    const users = await User.find({ role });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchUser = async (req, res) => {
  try {
    const { query } = req.query;
    const loggedInUser = req.user
    const role = loggedInUser.role;

    let filter = { name: { $regex: query, $option: 'i' } }

    if (role === 'admin') {
      // Admin can search all users
    } else if (role === 'doctor') {
      // Doctor can search only their patients
      filter.role = 'patient';
      filter.doctorId = loggedInUser._id;
    } else if (role === 'patient') {
      // Patient can search only approved doctors
      filter.role = 'doctor';
      filter.isApproved = true;
    }

    const users = await User.find(filter).select('-password');

    if (!users.length) {
      return res.status(200).json({ message: 'No users found', data: [] });
    }

    res.json({ message: 'Users found', data: users });
  } catch (err) {
    res.status(500).json({ message: "server error" })
  }
};
