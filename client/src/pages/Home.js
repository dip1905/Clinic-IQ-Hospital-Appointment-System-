import React from 'react';
import '../css/Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <h1 className="greet">Welcome to ClinicIQ</h1>
      <p className="greet-1">Smarter Healthcare, Simpler Appointments</p>
      {/* <div className="mt-4">
        <Link to="/register" className="btn btn-success me-2">Get Started</Link>
        <Link to="/login" className="btn btn-outline-light">Login</Link>
      </div> */}
    </div>
  );
}

export default Home;
