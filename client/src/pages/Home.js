import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

function Home() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-hero-eyebrow">Healthcare made simple</div>
        <h1>Book your doctor,<br />skip the wait</h1>
        <p>ClinicIQ connects patients with verified doctors. Appointments in seconds, from anywhere.</p>

        <div className="home-hero-btns">
          <Link to="/register" className="btn-hero-solid">Book appointment</Link>
          <Link to="/login"    className="btn-hero-outline">Login</Link>
        </div>

        <div className="home-stats">
          <div className="home-stat-item">
            <div className="home-stat-n">142+</div>
            <div className="home-stat-l">Patients</div>
          </div>
          <div className="home-stat-divider" />
          <div className="home-stat-item">
            <div className="home-stat-n">28</div>
            <div className="home-stat-l">Doctors</div>
          </div>
          <div className="home-stat-divider" />
          <div className="home-stat-item">
            <div className="home-stat-n">847</div>
            <div className="home-stat-l">Appointments</div>
          </div>
        </div>
      </div>

      <div className="home-features">
        <div className="home-feat-card">
          <div className="home-feat-icon" style={{ background: '#E6F1FB' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="12" height="12" rx="2" stroke="#185FA5" strokeWidth="1.2"/>
              <path d="M5 8h6M8 5v6" stroke="#185FA5" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="home-feat-title">One-click booking</div>
          <div className="home-feat-desc">Select a doctor, pick a time, confirm. No phone calls or queues.</div>
        </div>

        <div className="home-feat-card">
          <div className="home-feat-icon" style={{ background: '#E1F5EE' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="#0F6E56" strokeWidth="1.2"/>
              <path d="M5.5 8l2 2 3-3" stroke="#0F6E56" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="home-feat-title">Verified doctors</div>
          <div className="home-feat-desc">Every doctor is reviewed and approved by admin before joining.</div>
        </div>

        <div className="home-feat-card">
          <div className="home-feat-icon" style={{ background: '#EEEDFE' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 4h10M3 8h7M3 12h5" stroke="#534AB7" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="home-feat-title">Full appointment history</div>
          <div className="home-feat-desc">Track every past and upcoming appointment in one clean view.</div>
        </div>
      </div>

      <div className="home-footer">
        <span className="home-footer-copy">ClinicIQ &copy; 2026</span>
        <div className="home-footer-links">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>
      </div>
    </div>
  );
}

export default Home;
