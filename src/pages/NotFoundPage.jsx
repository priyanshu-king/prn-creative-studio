import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/shared/Nav';

const NotFoundPage = () => (
  <div>
    <Nav />
    <main id="main-content" style={{ textAlign: 'center', padding: '100px 24px', background: '#fff', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 80, marginBottom: 16, lineHeight: 1 }}>🎨</div>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 48, fontWeight: 900, background: 'linear-gradient(135deg, var(--prn-primary), var(--prn-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 12 }}>
        404
      </h1>
      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 12 }}>Page not found</div>
      <p style={{ fontSize: 16, color: 'var(--gray-500)', marginBottom: 32, maxWidth: 400 }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/" className="btn btn-primary">Go home</Link>
        <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link>
      </div>
    </main>
  </div>
);

export default NotFoundPage;
