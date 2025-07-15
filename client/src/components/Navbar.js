import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/api';

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
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <img src="/logo1.png" alt="ClinicIQ Logo" height="30" className="me-2" />
          ClinicIQ
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            {!name ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <span className="nav-link text-white">Welcome, {name} ({role})</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-light btn-sm ms-2" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
