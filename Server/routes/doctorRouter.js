const express = require('express');
const { getAllDoctors } = require('../controllers/doctorController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/doctors', verifyToken, getAllDoctors);

module.exports = router;
