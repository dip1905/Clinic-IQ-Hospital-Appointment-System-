import React from 'react';
import '../css/style.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container d-flex flex-column align-items-center justify-content-center text-white text-center">
      <h1 className="display-4 fw-bold">Welcome to ClinicIQ</h1>
      <p className="lead">Smarter Healthcare, Simpler Appointments</p>
      <div className="mt-4">
        <Link to="/register" className="btn btn-success me-2">Get Started</Link>
        <Link to="/login" className="btn btn-outline-light">Login</Link>
      </div>
    </div>
  );
}

export default Home;
