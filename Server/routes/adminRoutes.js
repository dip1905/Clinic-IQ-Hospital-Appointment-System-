const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const {
  getAllPatients,
  getAllDoctors,
  getAllAppointments,
  deleteAppointment,
  approveDoctor,
  blockUser,
  unblockUser
} = require('../controllers/adminController');

const router = express.Router();

router.get('/admin/users/patients', verifyToken, authorizeRoles('admin'), getAllPatients);
router.get('/admin/users/doctors', verifyToken, authorizeRoles('admin'), getAllDoctors);
router.get('/admin/appointments', verifyToken, authorizeRoles('admin'), getAllAppointments);
router.delete('/admin/appointments/:id', verifyToken, authorizeRoles('admin'), deleteAppointment);
router.patch('/admin/approve/:id', verifyToken, authorizeRoles('admin'), approveDoctor);
router.patch('/admin/block/:id', verifyToken, authorizeRoles('admin'), blockUser);
router.patch('/admin/unblock/:id', verifyToken, authorizeRoles('admin'), unblockUser);

module.exports = router;
