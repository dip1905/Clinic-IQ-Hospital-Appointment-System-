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
    const user = await User.findOne({ username }).select('+password');
    console.log("User found:", user);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log("User status - isApproved:", user.isApproved, "isBlocked:", user.isBlocked);
    if (user.isBlocked) {
      return res.status(403).json({ message: 'User is blocked by admin' });
    }

    if (user.role === 'doctor' && !user.isApproved) {
      return res.status(403).json({ message: 'Doctor not approved yet' });
    }
    console.log("Generating token for user:", user.username);
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    console.log("Token generated:", token);

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
    console.log("Login successful for user:", user.username);

  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error("Login error:", err);
  }
};


exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};
