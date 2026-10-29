import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const SignupPage = () => {
  const setUser = useAppStore((s) => s.setUser);
  const navigate = useNavigate();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim())  { setError('Please enter your name.'); return; }
    if (!email)        { setError('Please enter your email.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    try {
      const stored = localStorage.getItem('prn-users');
      const users = stored ? JSON.parse(stored) : [];

      if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        setError('An account with that email already exists.');
        setLoading(false);
        return;
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: email.toLowerCase(),
        password,               // In a real app, never store plain passwords!
        plan: 'free',
        createdAt: Date.now(),
        avatar: null,
      };

      users.push(newUser);
      localStorage.setItem('prn-users', JSON.stringify(users));

      const { password: _pw, ...safeUser } = newUser;
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
          <Link to="/" className="prn-logo" style={{ display: 'inline-block', fontSize: 28 }}>PRN</Link>
          <h1 className="auth-card-title">Create your account</h1>
          <p className="auth-card-subtitle">Free to start. No credit card needed.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="form-error" role="alert" style={{ fontSize: 14, padding: '10px 14px', background: '#fef2f2', borderRadius: 8, border: '1px solid #fecaca' }}>
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="signup-name">Full name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' }} />
              <input
                id="signup-name"
                type="text"
                className="form-input"
                style={{ paddingLeft: 38 }}
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' }} />
              <input
                id="signup-email"
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
            <label className="form-label" htmlFor="signup-password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' }} />
              <input
                id="signup-password"
                type="password"
                className="form-input"
                style={{ paddingLeft: 38 }}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
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
            {loading ? 'Creating account…' : 'Create free account'}
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
            {['No credit card required', 'Free plan available forever'].map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--gray-500)' }}>
                <CheckCircle2 size={13} color="#10b981" />
                {t}
              </div>
            ))}
          </div>
        </form>

        <div className="auth-divider" style={{ margin: '16px 0' }}>or</div>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

        <p style={{ fontSize: 12, color: 'var(--gray-400)', textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
          By creating an account you agree to our{' '}
          <Link to="/terms" style={{ color: 'var(--gray-500)' }}>Terms of Service</Link> and{' '}
          <Link to="/privacy" style={{ color: 'var(--gray-500)' }}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
