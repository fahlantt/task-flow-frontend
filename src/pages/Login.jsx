import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/login.css';
import API from '../api'; // gunakan file api.js

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Gagal decode token:', e);
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post('/auth/login', { email, password });
      const result = response.data;

      const token = result.token;
      localStorage.setItem('token', token);

      const decoded = decodeToken(token);
      if (decoded && decoded.id) {
        localStorage.setItem('userId', decoded.id);
      } else {
        alert('Login berhasil tapi userId tidak bisa diambil dari token.');
        return;
      }

      navigate('/home');
    } catch (error) {
      console.error('Terjadi kesalahan saat login:', error);
      alert('Login gagal. Cek email & password!');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="button-primary">Login</button>
      </form>
      <p>
        Belum punya akun? <Link to="/register">Daftar di sini</Link>
      </p>
    </div>
  );
};

export default Login;
