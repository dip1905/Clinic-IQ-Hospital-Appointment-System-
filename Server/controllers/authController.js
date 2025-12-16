const User = require('../models/User');
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const {
      name, email, mobile, username, password, role,
      specialization, qualification, experience, consultationFee
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      username,
      password: hashedPassword,
      role,
      isApproved: role === 'doctor' ? false : true,
      isBlocked: false
    });

    if (role === 'doctor') {
      await Doctor.create({
        user: user._id,
        specialization,
        qualification,
        experience,
        consultationFee
      });
    }

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'User is blocked by admin' });
    }

    if (user.role === 'doctor' && !user.isApproved) {
      return res.status(403).json({ message: 'Doctor not approved yet' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: false
      })
      .json({
        token,
        user: {
          username: user.username,
          role: user.role,
          name: user.name
        }
      });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};
