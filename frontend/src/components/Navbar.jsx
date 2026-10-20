import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Code2, Terminal, Image, User, LogIn, LogOut, Menu, X } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) onLogout();
    setMobileOpen(false);
    navigate('/login');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Project Logo & Title */}
        <Link to="/" className="nav-brand" id="nav-brand-logo" onClick={closeMobile}>
          <div className="nav-logo-icon">
            <Code2 size={24} />
          </div>
          <span className="nav-title">CodeCraft</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links" id="nav-desktop-links">
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
                {user?.name ? user.name.split(' ')[0] : 'Profile'}
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

        {/* Hamburger toggle – visible only on mobile */}
        <button
          className="nav-hamburger"
          id="nav-hamburger-btn"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile slide-down drawer */}
      {mobileOpen && (
        <nav className="nav-mobile-drawer" id="nav-mobile-drawer">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-mobile-link ${isActive ? 'active' : ''}`}
            id="nav-mobile-home"
            onClick={closeMobile}
          >
            Home
          </NavLink>

          <NavLink
            to="/editor"
            className={({ isActive }) => `nav-mobile-link ${isActive ? 'active' : ''}`}
            id="nav-mobile-editor"
            onClick={closeMobile}
          >
            <Terminal size={17} />
            Code Editor
          </NavLink>

          <NavLink
            to="/image-to-text"
            className={({ isActive }) => `nav-mobile-link ${isActive ? 'active' : ''}`}
            id="nav-mobile-ocr"
            onClick={closeMobile}
          >
            <Image size={17} />
            Image to Text
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) => `nav-mobile-link ${isActive ? 'active' : ''}`}
                id="nav-mobile-profile"
                onClick={closeMobile}
              >
                <User size={17} />
                {user?.name ? user.name.split(' ')[0] : 'Profile'}
              </NavLink>
              <button
                onClick={handleLogout}
                className="nav-mobile-link nav-mobile-logout"
                id="btn-mobile-logout"
                style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="btn btn-primary nav-mobile-cta"
              id="nav-mobile-auth"
              onClick={closeMobile}
            >
              <LogIn size={16} />
              Login / Register
            </NavLink>
          )}
        </nav>
      )}
    </header>
  );
}
