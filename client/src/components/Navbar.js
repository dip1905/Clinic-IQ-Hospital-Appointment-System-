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

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" >
          <div className="nav-logo">
            <img src="/logo1.png" alt="ClinicIQ" className='img' />
          </div>
          <h1>ClinicIQ</h1>
        </Link>
      </div>

      <div className="nav-right">
        {!name ? (
          <>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/register" className="nav-link">Register</Link>
            <Link to="/login" className="nav-link">Login</Link>
          </>
        ) : (
          <>
            <span className="nav-user">Welcome, {name} ({role})</span>
            <button className="nav-logout" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
