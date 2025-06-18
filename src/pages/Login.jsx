import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Fungsi decode JWT sederhana untuk ambil payload
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
    console.log('handleLogin triggered');
    console.log('Email:', email);
    console.log('Password:', password);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);

      const text = await response.text();
      console.log('Response text:', text);

      if (!response.ok) {
        alert('Login gagal: ' + text);
        return;
      }

      const result = JSON.parse(text);
      console.log('Hasil login:', result);

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
      alert('Terjadi kesalahan. Coba lagi!');
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
