import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn, UserPlus, AlertCircle, CheckCircle2, Shield, User, Mail, Phone, Briefcase, Lock } from 'lucide-react';

export default function AuthPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [isLoginTab, setIsLoginTab] = useState(true);

  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    work: '',
    password: '',
    cpassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await axios.post('/signin', loginData);
      setSuccess(response.data.message || 'Login successful!');
      if (onLoginSuccess) {
        onLoginSuccess({
          email: loginData.email,
          token: response.data.token,
          ...response.data.user,
        });
      }
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (registerData.password !== registerData.cpassword) {
      return setError('Passwords do not match');
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/register', registerData);
      setSuccess(response.data.message || 'User registered successfully! Please sign in.');
      setTimeout(() => {
        setIsLoginTab(true);
        setLoginData({ email: registerData.email, password: '' });
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div className="glass-panel auth-wrapper">
        {/* Tab Toggle */}
        <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-md)', padding: '4px', marginBottom: '24px' }}>
          <button
            onClick={() => { setIsLoginTab(true); setError(''); setSuccess(''); }}
            className={`btn ${isLoginTab ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, border: 'none', padding: '8px 12px' }}
            id="tab-btn-login"
          >
            <LogIn size={16} />
            Sign In
          </button>
          <button
            onClick={() => { setIsLoginTab(false); setError(''); setSuccess(''); }}
            className={`btn ${!isLoginTab ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, border: 'none', padding: '8px 12px' }}
            id="tab-btn-register"
          >
            <UserPlus size={16} />
            Register
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid var(--accent-rose)', color: '#fca5a5', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--accent-emerald)', color: '#6ee7b7', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        {/* Sign In Form */}
        {isLoginTab ? (
          <form onSubmit={handleLoginSubmit} id="form-signin">
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>Welcome Back</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Sign in to your CodeCraft account to manage and save code.
            </p>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="form-input"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  id="signin-email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="form-input"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                id="signin-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '12px' }}
              id="signin-submit-btn"
            >
              {isLoading ? 'Signing In...' : 'Sign In to CodeCraft'}
            </button>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegisterSubmit} id="form-register">
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>Create Account</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Join CodeCraft for seamless multi-language execution.
            </p>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                placeholder="Sneha Prajapati"
                className="form-input"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                id="register-name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                placeholder="sneha@example.com"
                className="form-input"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                id="register-email"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  className="form-input"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  id="register-phone"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Profession / Work</label>
                <input
                  type="text"
                  required
                  placeholder="Full-Stack Engineer"
                  className="form-input"
                  value={registerData.work}
                  onChange={(e) => setRegisterData({ ...registerData, work: e.target.value })}
                  id="register-work"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="form-input"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                id="register-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="form-input"
                value={registerData.cpassword}
                onChange={(e) => setRegisterData({ ...registerData, cpassword: e.target.value })}
                id="register-cpassword"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '12px' }}
              id="register-submit-btn"
            >
              {isLoading ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
