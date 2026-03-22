const express = require('express');
const {
  createAppointment,
  getAppointmentsForDoctor,
  getAppointmentsForUser,
  cancelAppointment,
  markAppointmentCompleted,
} = require('../controllers/appointmentController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/appointments', verifyToken, createAppointment);
router.get('/appointments/doctor/:doctor', verifyToken, getAppointmentsForDoctor);
router.get('/appointments/patient/:username', verifyToken, getAppointmentsForUser);

// FIXED: /complete/:id MUST come before /:id — Express matches top to bottom
// If /:id is first, it swallows 'complete' as an id value
router.patch('/appointments/complete/:id', verifyToken, markAppointmentCompleted);
router.patch('/appointments/:id', verifyToken, cancelAppointment);

module.exports = router;
