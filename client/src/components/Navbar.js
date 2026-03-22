import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/api';
import '../css/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');

  const handleLogout = async () => {
    await logout();
    localStorage.clear();
    navigate('/login');
  };

  const navClass = role === 'doctor'
    ? 'navbar role-doctor'
    : role === 'admin'
    ? 'navbar role-admin'
    : 'navbar';

  return (
    <nav className={navClass}>
      <div className="nav-left">
        <Link to={name ? (role === 'admin' ? '/admin' : '/dashboard') : '/'}>
          <div className="nav-logo-circle">CQ</div>
          <span className="nav-brand-name">ClinicIQ</span>
          {role && (
            <span className="nav-portal-badge">
              {role === 'patient' ? 'Patient' : role === 'doctor' ? 'Doctor' : 'Admin'}
            </span>
          )}
        </Link>
      </div>

      <div className="nav-right">
        {!name && (
          <>
            <Link to="/"         className="nav-link">Home</Link>
            <Link to="/register" className="nav-link">Register</Link>
            <Link to="/login"    className="nav-link">Login</Link>
          </>
        )}

        {name && role === 'patient' && (
          <Link to="/dashboard" className="nav-link">My appointments</Link>
        )}

        {name && role === 'doctor' && (
          <Link to="/dashboard" className="nav-link">My patients</Link>
        )}

        {name && role === 'admin' && (
          <>
            <Link to="/admin"                className="nav-link">Dashboard</Link>
            <Link to="/admin/users/patients" className="nav-link">Patients</Link>
            <Link to="/admin/users/doctors"  className="nav-link">Doctors</Link>
            <Link to="/admin/appointments"   className="nav-link">Appointments</Link>
          </>
        )}

        {name && (
          <>
            <span className="nav-user-pill">{name}</span>
            <button className="nav-logout-btn" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
