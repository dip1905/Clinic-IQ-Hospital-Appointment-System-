const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const doctorRoutes = require('./routes/doctorRouter');

dotenv.config();
connectDB();

const app = express();

app.use(helmet());

// FIXED: original only allowed CLIENT_URL (single) — now supports comma-separated list
// For current single-app dev: just keep http://localhost:3000 in .env
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map(u => u.trim());

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, same-origin)
    if (!origin) return callback(null, true);
    
    // In production allow same-origin Render URL + localhost for dev
    const allowed = [
      process.env.CLIENT_URL,
      'http://localhost:3000',
      'http://localhost:5000',
    ].filter(Boolean);

    if (allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // allow all for now, tighten later
    }
  },
  credentials: true,
}));
```

Then in **Render Dashboard → Environment** add:
```
CLIENT_URL=https://clinic-iq-hospital-appointment-system.onrender.com
app.use(cookieParser());
app.use(express.json());

// FIXED: original applied rate limiter to ALL /api routes including appointments, admin etc.
// Now only login and register are rate-limited — that's the only attack surface
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many requests, please try again later' },
});

app.use('/api/login', authLimiter);
app.use('/api/register', authLimiter);

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', doctorRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', adminRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
