import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import EditorPage from './pages/Editor';
import ImageToText from './pages/ImageToText';
import Register from './pages/Register';
import Login from './pages/Login';
import ProfilePage from './pages/Profile';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('codecraft_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
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
          {/* ── Public Routes ────────────────────────────────────── */}
          {/*
            / is PUBLIC so unauthenticated users see the landing page.
            Authenticated users are NOT forced away from it.
          */}
          <Route path="/" element={<Home />} />

          {/*
            /login – public; logged-in users are bounced to / so they
            don't see the login form unnecessarily.
          */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          {/*
            /register – public; logged-in users are bounced to /.
          */}
          <Route
            path="/register"
            element={user ? <Navigate to="/" replace /> : <Register />}
          />

          {/* Legacy /auth alias → /login */}
          <Route path="/auth" element={<Navigate to="/login" replace />} />

          {/* ── Private Routes ───────────────────────────────────── */}
          <Route
            path="/editor"
            element={
              <PrivateRoute user={user}>
                <EditorPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/image-to-text"
            element={
              <PrivateRoute user={user}>
                <ImageToText />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute user={user}>
                <ProfilePage user={user} onLogout={handleLogout} />
              </PrivateRoute>
            }
          />

          {/* Catch-all → home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
