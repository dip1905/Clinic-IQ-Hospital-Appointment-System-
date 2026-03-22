import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Patient from './pages/admin/Patient';
import Doctor from './pages/admin/Doctors';
import ManageAppointments from './pages/admin/ManageAppointments';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ marginTop: '58px' }}>
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/admin"                element={<AdminDashboard />} />
          <Route path="/admin/users/patients" element={<Patient />} />
          <Route path="/admin/users/doctors"  element={<Doctor />} />
          <Route path="/admin/appointments"   element={<ManageAppointments />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
