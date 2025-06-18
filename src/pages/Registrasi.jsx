import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/login.css';

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
      console.log('Mengirim request ke http://localhost:3001/api/auth/register...');
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      console.log('Response status:', response.status);

      const text = await response.text();
      console.log('Response body (raw):', text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (err) {
        console.error('Gagal parse response JSON:', err);
        alert('Gagal mendaftar: Response tidak valid dari server.');
        return;
      }

      if (!response.ok) {
        alert('Gagal daftar: ' + (result.message || 'Unknown error'));
        return;
      }

      alert('Registrasi berhasil');
      navigate('/login');
    } catch (error) {
      console.error('Gagal:', error);
      alert('Terjadi kesalahan saat registrasi.');
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
