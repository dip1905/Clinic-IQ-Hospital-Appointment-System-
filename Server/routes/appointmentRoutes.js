const express = require('express');
const {
  createAppointment,
  getAppointmentsForDoctor,
  getAppointmentsForUser,
  cancelAppointment,
} = require('../controllers/appointmentController');
const { markAppointmentCompleted } = require('../controllers/appointmentController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/appointments', verifyToken, createAppointment);
router.get('/appointments/doctor/:doctor', verifyToken, getAppointmentsForDoctor);
router.get('/appointments/patient/:username', verifyToken, getAppointmentsForUser);
router.patch('/appointments/:id', verifyToken, cancelAppointment);
router.patch('/appointments/complete/:id', verifyToken, markAppointmentCompleted);

module.exports = router;
