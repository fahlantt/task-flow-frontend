import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import '../assets/home-style.css';

function Home() {
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [importantDates, setImportantDates] = useState({});

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      console.warn('Token tidak tersedia. Redirect ke login.');
      navigate('/login');
      return;
    }

    // Fetch notes
    fetch(`http://localhost:3001/api/notes`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Gagal fetch notes');
        return res.json();
      })
      .then(data => setNotes(data))
      .catch(err => console.error('Error fetching notes:', err));

    // Fetch important dates
    fetch(`http://localhost:3001/api/important-dates`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Gagal fetch tanggal penting');
        return res.json();
      })
      .then(data => setImportantDates(data))
      .catch(err => console.error('Error fetching important dates:', err));
  }, [token, navigate]);

  const addNote = () => {
    if (!noteInput.trim()) return;

    fetch('http://localhost:3001/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: noteInput }),
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Gagal menambah catatan: ${res.status} - ${text}`);
        }
        return res.json();
      })
      .then(newNote => {
        setNotes(prevNotes => [newNote, ...prevNotes]);
        setNoteInput('');
      })
      .catch(err => console.error('Error adding note:', err));
  };

  const editNote = (id, currentText) => {
    const updatedText = prompt('Edit catatan:', currentText);
    if (updatedText && updatedText.trim() !== '') {
      fetch(`http://localhost:3001/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: updatedText }),
      })
        .then(async res => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Gagal mengedit catatan: ${res.status} - ${text}`);
          }
          return res.json();
        })
        .then(() => {
          setNotes(notes.map(note => (note.id === id ? { ...note, content: updatedText } : note)));
        })
        .catch(err => console.error('Error editing note:', err));
    }
  };

  const deleteNote = (id) => {
    fetch(`http://localhost:3001/api/notes/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.ok) {
          setNotes(notes.filter(note => note.id !== id));
        } else {
          console.error('Failed to delete note');
        }
      })
      .catch(err => console.error('Error deleting note:', err));
  };

  const addImportantDate = () => {
    const note = prompt('Masukkan catatan untuk tanggal ini:');
    if (note && note.trim() !== '') {
      const dateKey = selectedDate.toISOString().split('T')[0];
      fetch('http://localhost:3001/api/important-dates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: dateKey, description: note }),
      })
        .then(async res => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Gagal menambah tanggal penting: ${res.status} - ${text}`);
          }
          return res.json();
        })
        .then(() => {
          setImportantDates(prev => ({ ...prev, [dateKey]: note }));
        })
        .catch(err => console.error('Error adding important date:', err));
    }
  };

  const editImportantDate = (date) => {
    const currentNote = importantDates[date];
    const newNote = prompt('Edit catatan tanggal penting:', currentNote);
    if (newNote && newNote.trim() !== '') {
      fetch(`http://localhost:3001/api/important-dates/${date}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: newNote }),
      })
        .then(async res => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Gagal mengedit tanggal penting: ${res.status} - ${text}`);
          }
          return res.json();
        })
        .then(() => {
          setImportantDates(prev => ({ ...prev, [date]: newNote }));
        })
        .catch(err => console.error('Error editing important date:', err));
    }
  };

  const deleteImportantDate = (date) => {
    fetch(`http://localhost:3001/api/important-dates/${date}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.ok) {
          setImportantDates(prev => {
            const copy = { ...prev };
            delete copy[date];
            return copy;
          });
        } else {
          console.error('Failed to delete important date');
        }
      })
      .catch(err => console.error('Error deleting important date:', err));
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
                      <small>{note.created_at || note.date ? new Date(note.created_at || note.date).toLocaleString('id-ID') : '-'}</small>
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
