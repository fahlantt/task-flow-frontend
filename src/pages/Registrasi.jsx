import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/login.css';
import API from '../api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('handleRegister triggered');
    console.log('Data dikirim:', { username, email, password });

    try {
      const response = await API.post('/auth/register', {
        username,
        email,
        password,
      });

      console.log('Response:', response.data);

      alert('Registrasi berhasil');
      navigate('/login');
    } catch (error) {
      console.error('Gagal:', error);
      const message =
        error.response?.data?.message || 'Terjadi kesalahan saat registrasi.';
      alert('Gagal daftar: ' + message);
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
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button-primary">Daftar</button>
      </form>
      <p>Sudah punya akun? <Link to="/login">Login di sini</Link></p>
    </div>
  );
};

export default Register;
