const Appointment = require('../models/Appointment');
const User = require('../models/User');

// FIXED: was saving req.body directly — schema stores ObjectId refs, not strings
// Now looks up patient and doctor by username to get their _id
const createAppointment = async (req, res) => {
  try {
    const { patient: patientUsername, doctor: doctorUsername, date } = req.body;

    const patientUser = await User.findOne({ username: patientUsername });
    if (!patientUser) return res.status(404).json({ message: 'Patient not found' });

    const doctorUser = await User.findOne({ username: doctorUsername });
    if (!doctorUser) return res.status(404).json({ message: 'Doctor not found' });

    const newAppointment = new Appointment({
      patient: patientUser._id,
      doctor: doctorUser._id,
      date,
    });

    const saved = await newAppointment.save();

    // Return populated so the frontend gets names immediately
    const populated = await Appointment.findById(saved._id)
      .populate('patient', 'name username')
      .populate('doctor', 'name username');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// FIXED: was querying { doctor: "username_string" } but schema stores ObjectId
// Now finds the user first, then queries by _id
const getAppointmentsForDoctor = async (req, res) => {
  try {
    const { doctor: doctorUsername } = req.params;

    const doctorUser = await User.findOne({ username: doctorUsername });
    if (!doctorUser) return res.status(404).json({ message: 'Doctor not found' });

    const appointments = await Appointment.find({ doctor: doctorUser._id })
      .populate('patient', 'name username email')
      .populate('doctor', 'name username email')
      .sort({ date: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// FIXED: same ObjectId issue for patient queries
const getAppointmentsForUser = async (req, res) => {
  try {
    const { username } = req.params;

    const patientUser = await User.findOne({ username });
    if (!patientUser) return res.status(404).json({ message: 'Patient not found' });

    const appointments = await Appointment.find({ patient: patientUser._id })
      .populate('patient', 'name username email')
      .populate('doctor', 'name username email')
      .sort({ date: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appt = await Appointment.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    ).populate('patient', 'name username').populate('doctor', 'name username');

    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment cancelled', appointment: appt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const markAppointmentCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const appt = await Appointment.findByIdAndUpdate(
      id,
      { status: 'completed' },
      { new: true }
    ).populate('patient', 'name username').populate('doctor', 'name username');

    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Marked as completed', appointment: appt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createAppointment,
  getAppointmentsForDoctor,
  getAppointmentsForUser,
  cancelAppointment,
  markAppointmentCompleted,
};
