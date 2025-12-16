import axios from 'axios';

const API = axios.create({
  baseURL: 'https://cliniciq-hospital-appointment-system.onrender.com/api',
  withCredentials: true
});

export const login = (data) => API.post('/login', data);
export const register = (data) => API.post('/register', data);
export const logout = () => API.post('/logout');

export const getDoctors = () =>
  API.get('/users?role=doctor');
export const getAppointmentsForDoctor = (doctor) => API.get(`/appointments/doctor/${doctor}`);
export const getAppointmentsForPatient = (username) => API.get(`/appointments/patient/${username}`);
export const bookAppointment = (data) => API.post('/appointments', data);
export const cancelAppointment = (id) => API.patch(`/appointments/${id}`);
export const markCompleted = (id) => API.patch(`/appointments/complete/${id}`);
