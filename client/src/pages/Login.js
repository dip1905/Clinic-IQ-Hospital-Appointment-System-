import React, { useState, useEffect } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);

      // ✅ Store everything
      localStorage.setItem('username', res.data.user.username);
      localStorage.setItem('name', res.data.user.name);
      localStorage.setItem('role', res.data.user.role);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }

      navigate('/dashboard');
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form text-center">
      <h2>Login</h2>
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit" className="btn btn-primary mt-3">Login</button>
    </form>
  );
}

export default Login;
