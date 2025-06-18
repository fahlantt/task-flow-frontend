import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/login.css';
import API from '../api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert('Semua field wajib diisi!');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/auth/register', {
        username,
        email,
        password,
      });

      alert('Registrasi berhasil!');
      navigate('/login');
    } catch (error) {
      const message =
        error.response?.data?.message || 'Terjadi kesalahan saat registrasi.';
      alert('Gagal daftar: ' + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? 'Memproses...' : 'Daftar'}
        </button>
      </form>
      <p>Sudah punya akun? <Link to="/login">Login di sini</Link></p>
    </div>
  );
};

export default Register;
