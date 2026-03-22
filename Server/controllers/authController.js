const User = require('../models/User');
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const {
      name, email, mobile, username, password, role,
      specialization, qualification, experience, consultationFee
    } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({ message: 'Email already registered' });
      }
      return res.status(409).json({ message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      username,
      password: hashedPassword,
      role,
      isApproved: role === 'doctor' ? false : true,
      isBlocked: false,
    });

    if (role === 'doctor') {
      await Doctor.create({
        user: user._id,
        specialization,
        qualification,
        experience,
        consultationFee,
      });
    }

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select('+password');

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (user.isBlocked) return res.status(403).json({ message: 'User is blocked by admin' });

    if (user.role === 'doctor' && !user.isApproved) {
      return res.status(403).json({ message: 'Doctor not approved yet' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      })
      .json({
        token,
        user: {
          username: user.username,
          role: user.role,
          name: user.name,
        },
      });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

exports.logout = (req, res) => {
  try {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ message: 'Logout failed', error: err.message });
  }
};
