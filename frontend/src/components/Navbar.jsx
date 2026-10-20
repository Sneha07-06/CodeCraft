import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Code2, Terminal, Image, User, LogIn, LogOut, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Project Logo & Title */}
        <Link to="/" className="nav-brand" id="nav-brand-logo">
          <div className="nav-logo-icon">
            <Code2 size={24} />
          </div>
          <span className="nav-title">CodeCraft</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            id="nav-link-home"
          >
            Home
          </NavLink>

          <NavLink
            to="/editor"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            id="nav-link-editor"
          >
            <Terminal size={17} />
            Code Editor
          </NavLink>

          <NavLink
            to="/image-to-text"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            id="nav-link-image-to-text"
          >
            <Image size={17} />
            Image to Text
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                id="nav-link-profile"
              >
                <User size={17} />
                {user.name ? user.name.split(' ')[0] : 'User Profile'}
              </NavLink>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                id="btn-logout"
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                title="Logout"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                id="nav-link-profile"
              >
                <User size={17} />
                User Profile
              </NavLink>
              <NavLink
                to="/login"
                className="btn btn-primary"
                id="nav-link-auth"
                style={{ padding: '8px 18px', fontSize: '0.9rem' }}
              >
                <LogIn size={16} />
                Login / Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
