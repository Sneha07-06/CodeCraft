import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn, Mail, Lock, AlertCircle, CheckCircle2, ArrowRight, X, Sparkles } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: '', message: '' });
    }, 4000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showToast('error', 'Please provide both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/signin', {
        email: formData.email,
        password: formData.password,
      });

      const userData = {
        email: formData.email,
        token: response.data.token,
        ...(response.data.user || {}),
      };

      // Store authentication state locally
      localStorage.setItem('codecraft_user', JSON.stringify(userData));

      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }

      showToast('success', response.data.message || 'User Signin Successfully');

      // Redirect user directly to the Code Editor workspace
      setTimeout(() => {
        navigate('/editor');
      }, 900);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Invalid Credentials. Please check your credentials and try again.';
      showToast('error', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 16px', display: 'flex', justifyContent: 'center' }}>
      {/* Toast Alert Banner */}
      {toast.show && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 20px',
            borderRadius: 'var(--radius-md)',
            background: toast.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
            color: 'white',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            animation: 'fadeIn 0.3s ease-out',
          }}
          id="login-toast-alert"
        >
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{toast.message}</span>
          <button
            onClick={() => setToast({ show: false, type: '', message: '' })}
            style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Clean Card UI */}
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-brand)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              marginBottom: '14px',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            <LogIn size={26} />
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Sign In to CodeCraft</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            Enter your credentials to access your editor workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} id="login-form">
          {/* Email Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                id="login-email"
                name="email"
                required
                placeholder="name@example.com"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={formData.email}
                onChange={handleChange}
              />
              <Mail size={18} style={{ position: 'absolute', left: '13px', top: '12px', color: 'var(--text-dim)' }} />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="login-password">Password</label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                id="login-password"
                name="password"
                required
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={formData.password}
                onChange={handleChange}
              />
              <Lock size={18} style={{ position: 'absolute', left: '13px', top: '12px', color: 'var(--text-dim)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '14px', padding: '12px' }}
            id="login-submit-btn"
          >
            {isLoading ? 'Signing In...' : 'Sign In & Open Editor'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '26px', paddingTop: '18px', borderTop: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
