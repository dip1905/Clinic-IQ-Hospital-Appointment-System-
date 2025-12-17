import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageAppointments from './pages/admin/ManageAppointments';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');
  useEffect(() => {
  const token = localStorage.getItem('token');

  if (!token) {
    localStorage.clear();
  }
}, []);

  return (
    <Router>
      <Navbar />
      <div style={{ marginTop: '150px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/appointments" element={<ManageAppointments />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
