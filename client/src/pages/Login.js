import React, { useState, useEffect } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      const userData = res.data.user || res.data;
     // const { user, token } = res.data;
      if (!userData?.username || !userData?.role) {
        alert("Login data missing");
        return;
      }
      localStorage.setItem('username', userData.username);
      localStorage.setItem('name', userData.name || '');
      localStorage.setItem('role', userData.role);
      
      // if (res.data.token) {
      //   localStorage.setItem('token', token);
      // }
      

      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit" className="btn btn-primary mt-3">Login</button>
      </form>
    </div>
  );
}

export default Login;
