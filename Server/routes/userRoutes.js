const express = require('express');
const { getUsersByRole, searchUser } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/users', verifyToken, getUsersByRole);

// FIXED: searchUser was imported in original but route was never registered
router.get('/users/search', verifyToken, searchUser);

module.exports = router;
