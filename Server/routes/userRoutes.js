const express = require('express');
const { getUsersByRole } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/users', verifyToken, getUsersByRole);

module.exports = router;
