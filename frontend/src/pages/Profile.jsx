import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Phone, Briefcase, Calendar, Terminal, LogOut, ShieldCheck, Sparkles } from 'lucide-react';

export default function ProfilePage({ user, onLogout }) {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      // Check localStorage
      const saved = localStorage.getItem('codecraft_user');
      if (!saved) {
        navigate('/auth');
      } else {
        const parsed = JSON.parse(saved);
        setProfileData(parsed);
        fetchBackendProfile(parsed.email || parsed.id);
      }
    } else {
      setProfileData(user);
      fetchBackendProfile(user.email || user.id);
    }
  }, [user, navigate]);

  const fetchBackendProfile = async (identifier) => {
    if (!identifier) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`/profile/${identifier}`);
      if (response.data && response.data.user) {
        setProfileData(response.data.user);
      }
    } catch (err) {
      console.warn('Could not fetch remote profile, using local state.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/auth');
  };

  if (!profileData) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Redirecting to sign-in...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '50px 20px' }}>
      <div className="glass-panel" style={{ padding: '36px' }}>
        {/* Profile Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, color: 'white', boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }}>
              {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{profileData.name || 'CodeCraft Developer'}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{profileData.work || 'Software Engineer'}</p>
            </div>
          </div>

          <button onClick={handleLogout} className="btn btn-secondary" id="btn-profile-logout">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        {/* Profile Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-primary)', marginBottom: '8px' }}>
              <Mail size={18} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>EMAIL</span>
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>{profileData.email || 'N/A'}</p>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-secondary)', marginBottom: '8px' }}>
              <Phone size={18} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>PHONE</span>
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>{profileData.phone || 'N/A'}</p>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
              <Briefcase size={18} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>PROFESSION</span>
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>{profileData.work || 'Developer'}</p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '20px 24px', borderRadius: 'var(--radius-md)' }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Ready to write code?</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Launch the in-browser compiler to execute Python & Dart scripts.
            </p>
          </div>
          <Link to="/editor" className="btn btn-primary" id="btn-profile-launch-editor">
            <Terminal size={17} />
            Open Editor
          </Link>
        </div>
      </div>
    </div>
  );
}
