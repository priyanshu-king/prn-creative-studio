import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const Nav = () => {
  const user    = useAppStore((s) => s.user);
  const logout  = useAppStore((s) => s.logout);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);

  // Close mobile menu on route change or outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMobileOpen(false);
    };
    if (mobileOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [mobileOpen]);

  const handleLogout = () => { logout(); navigate('/'); };

  const links = [
    { to: '/features',  label: 'Features'  },
    { to: '/templates', label: 'Templates' },
    { to: '/pricing',   label: 'Pricing'   },
    { to: '/about',     label: 'About'     },
  ];

  return (
    <nav className="prn-nav" role="navigation" aria-label="Main navigation" ref={navRef}>
      <div className="prn-nav-inner">
        <Link to="/" className="prn-logo" aria-label="PRN home">PRN</Link>

        {/* Desktop links */}
        <ul className="prn-nav-links" role="list">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} className={({ isActive }) => isActive ? 'active' : undefined}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="prn-nav-spacer" />

        {/* Desktop actions */}
        <div className="prn-nav-actions">
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login"  className="btn btn-ghost btn-sm">Sign in</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Start free</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="prn-nav-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          id="mobile-nav-menu"
          role="menu"
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'rgba(245,242,235,0.98)', backdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--surface-3)',
            padding: '12px 20px 20px', display: 'flex', flexDirection: 'column', gap: 4,
            boxShadow: 'var(--shadow-lg)', zIndex: 100,
          }}
        >
          {links.map(({ to, label }) => (
            <NavLink
              key={to} to={to} role="menuitem"
              style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink-3)', padding: '8px 0' }}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <div style={{ height: 1, background: 'var(--surface-3)', margin: '8px 0' }} />
          {user ? (
            <>
              <Link to="/dashboard" style={{ fontSize: 15, fontWeight: 600, color: 'var(--prn-violet-dim)', padding: '8px 0' }} onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} style={{ background: 'none', border: 'none', fontSize: 15, fontWeight: 500, color: 'var(--ink-4)', textAlign: 'left', padding: '8px 0', cursor: 'pointer', fontFamily: 'inherit' }}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login"  className="btn btn-secondary" style={{ justifyContent: 'center', marginTop: 4 }} onClick={() => setMobileOpen(false)}>Sign in</Link>
              <Link to="/signup" className="btn btn-primary"   style={{ justifyContent: 'center', marginTop: 4 }} onClick={() => setMobileOpen(false)}>Start free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Nav;
