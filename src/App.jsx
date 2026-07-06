import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Transaksi from './pages/Transaksi';
import Kategori from './pages/Kategori';
import Analisis from './pages/Analisis';
import Sidebar from './components/Sidebar';
import './index.css';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('darkMode', next);
  };

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {isLoggedIn ? (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout} />
          <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
            <Routes>
              <Route path="/"          element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transaksi" element={<Transaksi />} />
              <Route path="/kategori"  element={<Kategori />} />
              <Route path="/analisis"  element={<Analisis />} />
              <Route path="*"          element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*"      element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}
