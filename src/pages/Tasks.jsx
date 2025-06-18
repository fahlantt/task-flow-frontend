import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import '../assets/tasks-style.css';

function Tasks() {
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      const response = await API.get('/tasks');
      const active = response.data.filter(task => task.status !== 'completed');
      const completed = response.data.filter(task => task.status === 'completed');
      setTasks(active);
      setCompletedTasks(completed);
    } catch (error) {
      console.error('Gagal mengambil task:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (taskInput.trim() === '') return;

    try {
      await API.post('/tasks', { title: taskInput });
      setTaskInput('');
      fetchTasks();
    } catch (error) {
      console.error('Gagal menambah task:', error);
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm('Yakin ingin menghapus tugas ini?')) {
      try {
        await API.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (error) {
        console.error('Gagal hapus task:', error);
      }
    }
  };

  const editTask = async (id) => {
    const newTitle = prompt('Edit tugas:');
    if (newTitle !== null && newTitle.trim() !== '') {
      try {
        await API.put(`/tasks/${id}`, { title: newTitle.trim() });
        fetchTasks();
      } catch (error) {
        console.error('Gagal update task:', error);
      }
    }
  };

  const markAsCompleted = async (id) => {
    try {
      await API.put(`/tasks/${id}`, { status: 'completed' });
      fetchTasks();
    } catch (error) {
      console.error('Gagal tandai selesai:', error);
    }
  };

  const undoCompletedTask = async (id) => {
    try {
      await API.put(`/tasks/${id}`, { status: 'pending' });
      fetchTasks();
    } catch (error) {
      console.error('Gagal undo tugas:', error);
    }
  };

  return (
    <div className="wrapper large-wrapper">
      <button className="back-button" onClick={() => navigate('/home')}>
        ← Kembali ke Home
      </button>

      <h1>Daftar Tugas</h1>

      <form id="taskForm" onSubmit={addTask}>
        <input
          type="text"
          id="taskInput"
          placeholder="Tulis tugasmu..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          required
        />
        <button type="submit">Tambah</button>
      </form>

      {tasks.length > 0 && (
        <>
          <h2>Tugas Aktif</h2>
          <ul id="taskList">
            {tasks.map((task) => (
              <li key={task.id}>
                <span className="task-text">{task.title}</span>
                <button className="edit" onClick={() => editTask(task.id)}>Edit</button>
                <button className="delete" onClick={() => deleteTask(task.id)}>Hapus</button>
                <button className="complete" onClick={() => markAsCompleted(task.id)}>Selesai</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {completedTasks.length > 0 && (
        <>
          <h2>Tugas Selesai</h2>
          <ul id="taskList" className="completed-list">
            {completedTasks.map((task) => (
              <li key={task.id}>
                <span className="task-text">✅ {task.title}</span>
                <button className="undo" onClick={() => undoCompletedTask(task.id)}>Batalkan</button>
                <button className="delete" onClick={() => deleteTask(task.id)}>Hapus</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Tasks;
