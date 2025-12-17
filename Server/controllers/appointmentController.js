const Appointment = require('../models/Appointment');

const createAppointment = async (req, res) => {
  try {
    const { doctorId, date } = req.body;

if (!doctorId || !date) {
  return res.status(400).json({ message: "Doctor and date are required" });
}

const appointment = await Appointment.create({
  patient: req.user.id,
  doctor: doctorId,
  date: new Date(date),
  status: "booked"
});
    
    res.status(201).json({
      message: "Appointment booked successfully",
      saved
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getAppointmentsForDoctor = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.id
    })
      .populate("patient", "name email username")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAppointmentsForUser = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user.id
    })
      .populate("doctor", "name username")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
