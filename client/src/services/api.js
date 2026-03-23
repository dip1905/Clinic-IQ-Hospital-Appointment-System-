import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Attach token from localStorage to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login    = (data) => API.post('/login', data);
export const register = (data) => API.post('/register', data);
export const logout   = ()     => API.post('/logout');

export const getDoctors                = ()     => API.get('/doctors');
export const getAppointmentsForDoctor  = (u)    => API.get(`/appointments/doctor/${u}`);
export const getAppointmentsForPatient = (u)    => API.get(`/appointments/patient/${u}`);
export const bookAppointment           = (data) => API.post('/appointments', data);
export const cancelAppointment         = (id)   => API.patch(`/appointments/${id}`);
export const markCompleted             = (id)   => API.patch(`/appointments/complete/${id}`);
export const searchUsers               = (q)    => API.get(`/users/search?query=${q}`);

export const adminGetPatients       = ()   => API.get('/admin/users/patients');
export const adminGetDoctors        = ()   => API.get('/admin/users/doctors');
export const adminGetAppointments   = ()   => API.get('/admin/appointments');
export const adminApproveDoctor     = (id) => API.patch(`/admin/approve/${id}`);
export const adminBlockUser         = (id) => API.patch(`/admin/block/${id}`);
export const adminUnblockUser       = (id) => API.patch(`/admin/unblock/${id}`);
export const adminDeleteUser        = (id) => API.delete(`/admin/users/${id}`);
export const adminDeleteAppointment = (id) => API.delete(`/admin/appointments/${id}`);
