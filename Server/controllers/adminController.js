const User = require('../models/User');
const Appointment = require('../models/Appointment');

exports.getAllPatients = async (req, res) => {
  try {
    const patient = await User.find({role:'patient'}).select('-password');
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDoctors = async (req, res)=>{
  try{
    const doctors = await User.find({role:'doctor'}).select('-password')
  res.json(doctors);
  }catch(err){
    res.status(500).json({error:err.message})
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveDoctor = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );
  res.json({ message: 'Doctor approved', user });
};

exports.blockUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBlocked: true },
    { new: true }
  );
  res.json({ message: 'User blocked', user });
};

exports.unblockUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBlocked: false },
    { new: true }
  );
  res.json({ message: 'User unblocked', user });
};
