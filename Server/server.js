const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path'); 
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const doctorRoutes = require('./routes/doctorRouter');


dotenv.config();
connectDB();
const app = express();
app.use(cors({
  // origin: 'https://clinic-iq-hospital-appointment-system.onrender.com',
  origin: 'https://cliniciqhms.netlify.app',
  credentials: true
}));
// app.use(cors({
//   origin: true,
//   credentials: true
// }));

app.use(cookieParser());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', doctorRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
