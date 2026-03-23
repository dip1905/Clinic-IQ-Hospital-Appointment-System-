const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Try cookie first, then Authorization header as fallback
  const token = req.cookies.token || 
    req.headers.authorization?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = { verifyToken };
