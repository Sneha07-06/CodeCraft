import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import EditorPage from './pages/Editor';
import ImageToText from './pages/ImageToText';
import Register from './pages/Register';
import Login from './pages/Login';
import ProfilePage from './pages/Profile';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('codecraft_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('codecraft_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('codecraft_user');
  };

  return (
    <div className="app-wrapper">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/image-to-text" element={<ImageToText />} />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/auth"
            element={<Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={<ProfilePage user={user} onLogout={handleLogout} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
