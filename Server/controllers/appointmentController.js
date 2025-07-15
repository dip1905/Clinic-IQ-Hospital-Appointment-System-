const Appointment = require('../models/Appointment');

// CREATE an appointment
const createAppointment = async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all appointments for a doctor
const getAppointmentsForDoctor = async (req, res) => {
  try {
    const { doctor } = req.params;
    const appointments = await Appointment.find({ doctor });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all appointments for a patient
const getAppointmentsForUser = async (req, res) => {
  try {
    const { username } = req.params;
    const appointments = await Appointment.find({ patient: username });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CANCEL an appointment
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appt = await Appointment.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
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
    );
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
