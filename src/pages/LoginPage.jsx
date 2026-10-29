import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const LoginPage = () => {
  const setUser = useAppStore((s) => s.setUser);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);

    // Simulate auth — in production this calls your backend
    await new Promise((r) => setTimeout(r, 600));

    // Check against locally stored users
    try {
      const stored = localStorage.getItem('prn-users');
      const users = stored ? JSON.parse(stored) : [];
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!found) {
        setError('Incorrect email or password. Please try again.');
        setLoading(false);
        return;
      }

      // Omit password from stored user session
      const { password: _pw, ...safeUser } = found;
      setUser(safeUser);
      navigate('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <Link to="/" className="prn-logo" style={{ display: 'inline-block', fontSize: 28, textDecoration: 'none' }}>PRN</Link>
          <h1 className="auth-card-title">Welcome back</h1>
          <p className="auth-card-subtitle">Sign in to your PRN account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="form-error" role="alert" style={{ fontSize: 14, padding: '10px 14px', background: '#fef2f2', borderRadius: 8, border: '1px solid #fecaca' }}>
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' }} />
              <input
                id="login-email"
                type="email"
                className="form-input"
                style={{ paddingLeft: 38 }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' }} />
              <input
                id="login-password"
                type="password"
                className="form-input"
                style={{ paddingLeft: 38 }}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="auth-divider" style={{ margin: '16px 0' }}>or</div>

        <p className="auth-footer-text">
          Don't have an account? <Link to="/signup">Create one free</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
