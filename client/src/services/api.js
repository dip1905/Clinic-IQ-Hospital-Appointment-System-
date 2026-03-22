import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export const login = (data) => API.post('/login', data);
export const register = (data) => API.post('/register', data);
export const logout = () => API.post('/logout');

// FIXED: was /users?role=doctor which returns User model (no specialization/fee)
// Now hits /doctors which returns the Doctor model populated with user data
// Dashboard.js uses doc.user.name and doc.user._id after this fix
export const getDoctors = () => API.get('/doctors');

export const getAppointmentsForDoctor = (doctor) => API.get(`/appointments/doctor/${doctor}`);
export const getAppointmentsForPatient = (username) => API.get(`/appointments/patient/${username}`);
export const bookAppointment = (data) => API.post('/appointments', data);
export const cancelAppointment = (id) => API.patch(`/appointments/${id}`);
export const markCompleted = (id) => API.patch(`/appointments/complete/${id}`);

export const searchUsers = (query) => API.get(`/users/search?query=${query}`);
