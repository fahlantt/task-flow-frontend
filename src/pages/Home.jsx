import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import '../assets/home-style.css';
import API from '../api';

function Home() {
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [importantDates, setImportantDates] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    API.get('/notes', { headers })
      .then(res => setNotes(res.data))
      .catch(err => console.error('Error fetching notes:', err));

    API.get('/important-dates', { headers })
      .then(res => setImportantDates(res.data))
      .catch(err => console.error('Error fetching important dates:', err));
  }, [token, navigate]);

  const addNote = async () => {
    if (!noteInput.trim()) return;
    try {
      const res = await API.post('/notes', { content: noteInput }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(prev => [res.data, ...prev]);
      setNoteInput('');
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  const editNote = async (id, currentText) => {
    const updatedText = prompt('Edit catatan:', currentText);
    if (!updatedText || updatedText.trim() === '') return;
    try {
      await API.put(`/notes/${id}`, { content: updatedText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(notes.map(note => (note.id === id ? { ...note, content: updatedText } : note)));
    } catch (err) {
      console.error('Error editing note:', err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await API.delete(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const addImportantDate = async () => {
    const note = prompt('Masukkan catatan untuk tanggal ini:');
    if (!note || note.trim() === '') return;
    const dateKey = selectedDate.toISOString().split('T')[0];
    try {
      await API.post('/important-dates', {
        date: dateKey,
        description: note
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setImportantDates(prev => ({ ...prev, [dateKey]: note }));
    } catch (err) {
      console.error('Error adding important date:', err);
    }
  };

  const editImportantDate = async (date) => {
    const currentNote = importantDates[date];
    const newNote = prompt('Edit catatan tanggal penting:', currentNote);
    if (!newNote || newNote.trim() === '') return;
    try {
      await API.put(`/important-dates/${date}`, {
        description: newNote
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setImportantDates(prev => ({ ...prev, [date]: newNote }));
    } catch (err) {
      console.error('Error editing important date:', err);
    }
  };

  const deleteImportantDate = async (date) => {
    try {
      await API.delete(`/important-dates/${date}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setImportantDates(prev => {
        const copy = { ...prev };
        delete copy[date];
        return copy;
      });
    } catch (err) {
      console.error('Error deleting important date:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container daily-notes">
      <h1 className="title">📒 TaskFlow</h1>

      <div className="header-buttons">
        <button className="button-secondary" onClick={logout}>🔓 Logout</button>
        <button className="button-toggle" onClick={() => document.body.classList.toggle('dark')}>🌙 Mode Gelap</button>
        <button className="button-primary" onClick={() => navigate('/tasks')}>📋 Lihat Tugas</button>
      </div>

      <div className="content-container">
        <div className="notes-container">
          <h2 className="section-title">✏️ Catatan Harian</h2>
          <div className="input-section">
            <input
              type="text"
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              placeholder="Tambahkan catatan..."
              className="input-box"
            />
            <button className="button-primary" onClick={addNote}>➕ Tambah</button>
          </div>
          <ul className="notes-list">
            {Array.isArray(notes) && notes.length > 0 ? (
              notes.map(note => (
                <li key={note.id} className="note-item">
                  <div className="note-content">
                    <span>{note.content}</span>
                    <div className="note-footer">
                      <small>{note.createdAt ? new Date(note.createdAt).toLocaleString('id-ID') : '-'}</small>
                      <div className="button-group">
                        <button onClick={() => editNote(note.id, note.content)} className="edit-btn">✏️ Edit</button>
                        <button onClick={() => deleteNote(note.id)} className="delete-btn">🗑️ Hapus</button>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li>Tidak ada catatan</li>
            )}
          </ul>
        </div>

        <div className="calendar-container">
          <h2 className="section-title">📅 Kalender</h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={({ date }) => {
              const dateStr = date.toISOString().split('T')[0];
              if (importantDates[dateStr]) {
                return <div className="important-date-dot" title={importantDates[dateStr]}>•</div>;
              }
              return null;
            }}
          />
          <button className="button-primary" onClick={addImportantDate}>➕ Tambah Tanggal Penting</button>

          <ul className="important-dates-list">
            {importantDates && Object.keys(importantDates).length > 0 ? (
              Object.entries(importantDates).map(([date, desc]) => (
                <li key={date}>
                  <strong>{date}</strong>: {desc}
                  <button onClick={() => editImportantDate(date)} className="edit-btn">✏️</button>
                  <button onClick={() => deleteImportantDate(date)} className="delete-btn">🗑️</button>
                </li>
              ))
            ) : (
              <li>Tidak ada tanggal penting</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
