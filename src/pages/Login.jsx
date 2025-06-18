import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/login.css';
import API from '../api';

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

    if (!email || !password) {
      alert('Email dan password harus diisi.');
      return;
    }

    try {
      const response = await API.post('/auth/login', { email, password });
      const result = response.data;

      if (!result.token) {
        alert('Login gagal: token tidak ditemukan.');
        return;
      }

      const token = result.token;
      localStorage.setItem('token', token);

      const decoded = decodeToken(token);
      if (decoded?.id) {
        localStorage.setItem('userId', decoded.id);
        navigate('/home');
      } else {
        alert('Login berhasil tapi userId tidak ditemukan di token.');
      }

    } catch (error) {
      console.error('Terjadi kesalahan saat login:', error);
      alert(error.response?.data?.message || 'Login gagal. Cek email & password!');
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
