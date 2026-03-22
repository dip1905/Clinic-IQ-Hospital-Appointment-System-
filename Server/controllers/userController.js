const User = require('../models/User');

exports.getUsersByRole = async (req, res) => {
  try {
    const role = req.query.role;
    const query = role ? { role } : {};
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchUser = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Search query is required', data: [] });
    }

    const loggedInUser = req.user;
    const role = loggedInUser.role;

    // FIXED: was $option (typo) — should be $options
    let filter = { name: { $regex: query, $options: 'i' } };

    if (role === 'admin') {
      // Admin can search all users — no extra filters
    } else if (role === 'doctor') {
      // FIXED: removed invalid filter.doctorId — that field doesn't exist on User model
      // Doctor can search patients only
      filter.role = 'patient';
    } else if (role === 'patient') {
      // Patient can search approved, unblocked doctors only
      filter.role = 'doctor';
      filter.isApproved = true;
      filter.isBlocked = false;
    }

    const users = await User.find(filter).select('-password');

    if (!users.length) {
      return res.status(200).json({ message: 'No users found', data: [] });
    }

    res.json({ message: 'Users found', data: users });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
