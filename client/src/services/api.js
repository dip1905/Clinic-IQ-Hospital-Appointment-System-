import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true // ✅ critical for cookies
});

// No need for token in headers if using cookies
export const login = (data) => API.post('/login', data);
export const register = (data) => API.post('/register', data);
export const logout = () => API.post('/logout');

export const getDoctors = () =>
  API.get('/users?role=doctor');  // this is correct
export const getAppointmentsForDoctor = (doctor) => API.get(`/appointments/doctor/${doctor}`);
export const getAppointmentsForPatient = (username) => API.get(`/appointments/patient/${username}`);
export const bookAppointment = (data) => API.post('/appointments', data);
export const cancelAppointment = (id) => API.patch(`/appointments/${id}`);
export const markCompleted = (id) => API.patch(`/appointments/complete/${id}`);
