import React, { useState } from 'react';
import { register } from '../services/api';
import '../css/Register.css';

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    username: '',
    password: '',
    role: ''
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert('Registration successful');
    } catch (err) {
      alert('Registration failed');
    }
    setForm({
      name: '',
      email: '',
      mobile: '',
      username: '',
      password: '',
      role: ''
    });   
    
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
        <input name="mobile" placeholder="Mobile Number" type="tel" onChange={handleChange} required />
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <select name="role" onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>
        {form.role === 'doctor' && (
          <>
            <input name="specialization" placeholder="Specialization" onChange={handleChange} />
            <input name="qualification" placeholder="Qualification" onChange={handleChange} />
            <input name="experience" type="number" placeholder="Experience" onChange={handleChange} />
            <input name="consultationFee" type="number" placeholder="Consultation Fee" onChange={handleChange} />
          </>
        )}

        <button type="submit" className="btn btn-success mt-3">Register</button>
      </form>
    </div>
  );
}

export default Register;
