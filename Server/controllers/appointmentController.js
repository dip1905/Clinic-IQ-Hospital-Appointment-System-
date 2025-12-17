const Appointment = require('../models/Appointment');

// const createAppointment = async (req, res) => {
//   try {
//     const newAppointment = new Appointment(req.body);
//     const savedAppointment = await newAppointment.save();
//     res.status(201).json(savedAppointment);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const createAppointment = async (req, res) => {
  try {
    const { patient, doctor, date, time } = req.body;

    if (!patient || !doctor || !date ) {
      return res.status(400).json({
        message: 'patient, doctor and date are required'
      });
    }
     const patientExists = await User.findOne({ username: patient });
    const doctorExists = await User.findOne({ username: doctor });
    if (!patientExists || !doctorExists) {
      return res.status(400).json({ message: 'Invalid patient or doctor username' });
    }

    const newAppointment = new Appointment({
      patient,
      doctor,
      date,
      status: 'booked'
    });
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);

  } catch (err) {
    console.error('CREATE APPOINTMENT ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

// const getAppointmentsForDoctor = async (req, res) => {
//   try {
//     const { doctor } = req.params;
//     const appointments = await Appointment.find({ doctor });
//     res.json(appointments);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const getAppointmentsForDoctor = async (req, res) => {
  try {
    const { doctor } = req.params;

    if (!doctor) {
      return res.status(400).json({ message: 'Doctor username is required' });
    }

    const appointments = await Appointment.find({ doctor });
    res.json(appointments);

  } catch (err) {
    console.error('GET DOCTOR APPOINTMENTS ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};


// const getAppointmentsForUser = async (req, res) => {
//   try {
//     const { username } = req.params;
//     const appointments = await Appointment.find({ patient: username });
//     res.json(appointments);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const getAppointmentsForUser = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const appointments = await Appointment.find({ patient: username });
    res.json(appointments);

  } catch (err) {
    console.error('GET PATIENT APPOINTMENTS ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

// const cancelAppointment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const appt = await Appointment.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
//     if (!appt) return res.status(404).json({ message: 'Appointment not found' });
//     res.json({ message: 'Appointment cancelled', appointment: appt });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appt = await Appointment.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!appt) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment cancelled', appointment: appt });

  } catch (err) {
    console.error('CANCEL APPOINTMENT ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

// const markAppointmentCompleted = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const appt = await Appointment.findByIdAndUpdate(
//       id,
//       { status: 'completed' },
//       { new: true }
//     );
//     if (!appt) return res.status(404).json({ message: 'Appointment not found' });
//     res.json({ message: 'Marked as completed', appointment: appt });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const markAppointmentCompleted = async (req, res) => {
  try {
    const { id } = req.params;

    const appt = await Appointment.findByIdAndUpdate(
      id,
      { status: 'completed' },
      { new: true }
    );

    if (!appt) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Marked as completed', appointment: appt });

  } catch (err) {
    console.error('MARK COMPLETED ERROR:', err);
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
