import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Patient from './pages/admin/Patient';
import Doctor from './pages/admin/Doctors';
import ManageAppointments from './pages/admin/ManageAppointments';

function PrivateRoute({ children, role }) {
  const userRole = localStorage.getItem('role');
  const name = localStorage.getItem('name');
  if (!name) return <Navigate to="/login" replace />;
  if (role && userRole !== role) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');

  return (
    <Router>
      <Navbar />
      <div style={{ marginTop: '58px' }}>
        <Routes>
          <Route
            path="/"
            element={
              !name ? <Home /> :
              role === 'admin' ? <Navigate to="/admin" replace /> :
              <Navigate to="/dashboard" replace />
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login"    element={<Login />} />

          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />

          <Route path="/admin" element={
            <PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>
          } />
          <Route path="/admin/users/patients" element={
            <PrivateRoute role="admin"><Patient /></PrivateRoute>
          } />
          <Route path="/admin/users/doctors" element={
            <PrivateRoute role="admin"><Doctor /></PrivateRoute>
          } />
          <Route path="/admin/appointments" element={
            <PrivateRoute role="admin"><ManageAppointments /></PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;