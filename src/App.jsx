import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Tasks from './pages/Tasks.jsx';
import Register from './pages/Registrasi.jsx';

function App() {
  return (
    <Routes>
      {/* Redirect default '/' ke '/login' */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Route utama */}
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/register" element={<Register />} />

      {/* Fallback jika route tidak ditemukan */}
      <Route path="*" element={<h1>404 - Halaman tidak ditemukan</h1>} />
    </Routes>
  );
}

export default App;
