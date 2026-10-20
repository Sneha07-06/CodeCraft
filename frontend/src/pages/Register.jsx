import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Phone, Briefcase, Lock, UserPlus, AlertCircle, CheckCircle2, ArrowRight, X } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    work: '',
    password: '',
    cpassword: '',
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

    // Client-side validation: Password match check
    if (formData.password !== formData.cpassword) {
      showToast('error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      showToast('error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        work: formData.work,
        password: formData.password,
        cpassword: formData.cpassword,
      });

      showToast('success', response.data.message || 'Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Registration failed. Please check your information and try again.';
      showToast('error', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 16px', display: 'flex', justifyContent: 'center' }}>
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
          id="register-toast-alert"
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

      <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '36px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
            <UserPlus size={26} />
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Create an Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            Join CodeCraft to run, extract, and manage code snippets.
          </p>
        </div>

        <form onSubmit={handleSubmit} id="register-form">
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                id="register-name"
                name="name"
                required
                placeholder="Sneha Prajapati"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={formData.name}
                onChange={handleChange}
              />
              <User size={18} style={{ position: 'absolute', left: '13px', top: '12px', color: 'var(--text-dim)' }} />
            </div>
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                id="register-email"
                name="email"
                required
                placeholder="sneha@example.com"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={formData.email}
                onChange={handleChange}
              />
              <Mail size={18} style={{ position: 'absolute', left: '13px', top: '12px', color: 'var(--text-dim)' }} />
            </div>
          </div>

          {/* Phone & Profession 2-Column Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="register-phone">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  id="register-phone"
                  name="phone"
                  required
                  placeholder="9876543210"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  value={formData.phone}
                  onChange={handleChange}
                />
                <Phone size={17} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-work">Profession / Work</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  id="register-work"
                  name="work"
                  required
                  placeholder="Full-Stack Developer"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  value={formData.work}
                  onChange={handleChange}
                />
                <Briefcase size={17} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                id="register-password"
                name="password"
                required
                placeholder="At least 6 characters"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={formData.password}
                onChange={handleChange}
              />
              <Lock size={18} style={{ position: 'absolute', left: '13px', top: '12px', color: 'var(--text-dim)' }} />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-cpassword">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                id="register-cpassword"
                name="cpassword"
                required
                placeholder="Re-enter password"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={formData.cpassword}
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
            id="register-submit-btn"
          >
            {isLoading ? 'Creating Account...' : 'Register for CodeCraft'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
