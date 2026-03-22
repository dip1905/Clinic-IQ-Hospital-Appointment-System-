import React, { useState } from 'react';
import { register } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Auth.css';

function Register() {
  const [form, setForm] = useState({
    name: '', email: '', mobile: '', username: '', password: '', role: '',
    specialization: '', qualification: '', experience: '', consultationFee: '',
  });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      setSuccess(
        form.role === 'doctor'
          ? 'Registered! Wait for admin approval before logging in.'
          : 'Registration successful! Redirecting to login...'
      );
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '32px' }}>
      <div className="auth-card" style={{ maxWidth: '460px' }}>
        <div className="auth-logo-row">
          <div className="auth-logo-circle">CQ</div>
        </div>
        <div className="auth-title">Create account</div>
        <div className="auth-subtitle">Join ClinicIQ as a patient or doctor</div>

        {error   && <div className="auth-alert danger">{error}</div>}
        {success && <div className="auth-alert success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-field-label">Full name</label>
            <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="auth-field-2col">
            <div className="auth-field">
              <label className="auth-field-label">Email</label>
              <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="auth-field">
              <label className="auth-field-label">Mobile</label>
              <input name="mobile" type="tel" placeholder="Mobile number" value={form.mobile} onChange={handleChange} required />
            </div>
          </div>

          <div className="auth-field-2col">
            <div className="auth-field">
              <label className="auth-field-label">Username</label>
              <input name="username" placeholder="Choose a username" value={form.username} onChange={handleChange} required />
            </div>
            <div className="auth-field">
              <label className="auth-field-label">Password</label>
              <input type="password" name="password" placeholder="Create a password" value={form.password} onChange={handleChange} required />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-field-label">Role</label>
            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="">Select your role</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {form.role === 'doctor' && (
            <div className="auth-doctor-extra">
              <div className="auth-doctor-extra-label">Doctor details</div>
              <div className="auth-doctor-extra-grid">
                <div className="auth-field">
                  <label className="auth-field-label">Specialization</label>
                  <input name="specialization" placeholder="e.g. Cardiologist" value={form.specialization} onChange={handleChange} />
                </div>
                <div className="auth-field">
                  <label className="auth-field-label">Qualification</label>
                  <input name="qualification" placeholder="e.g. MBBS, MD" value={form.qualification} onChange={handleChange} />
                </div>
                <div className="auth-field">
                  <label className="auth-field-label">Experience (years)</label>
                  <input name="experience" type="number" placeholder="Years" value={form.experience} onChange={handleChange} />
                </div>
                <div className="auth-field">
                  <label className="auth-field-label">Consultation fee (₹)</label>
                  <input name="consultationFee" type="number" placeholder="Amount" value={form.consultationFee} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`auth-submit-btn${form.role === 'doctor' ? ' doctor' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Creating account...
              </>
            ) : 'Create account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
