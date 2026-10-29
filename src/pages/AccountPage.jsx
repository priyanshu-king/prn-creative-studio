import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, LogOut, CreditCard, Shield } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import Nav from '../components/shared/Nav';

const AccountPage = () => {
  const user    = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const logout  = useAppStore((s) => s.logout);
  const navigate = useNavigate();

  const [name,    setName]    = useState(user?.name    || '');
  const [email,   setEmail]   = useState(user?.email   || '');
  const [saved,   setSaved]   = useState(false);
  const [section, setSection] = useState('profile');

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <p style={{ marginBottom: 20 }}>You need to be signed in to view your account.</p>
        <Link to="/login" className="btn btn-primary">Sign in</Link>
      </div>
    );
  }

  const handleSave = () => {
    // Update local storage and store
    const stored = localStorage.getItem('prn-users');
    if (stored) {
      const users = JSON.parse(stored);
      const updated = users.map((u) => u.id === user.id ? { ...u, name, email } : u);
      localStorage.setItem('prn-users', JSON.stringify(updated));
    }
    setUser({ ...user, name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { id: 'profile',  label: 'Profile',       NavIcon: User      },
    { id: 'billing',  label: 'Plan & Billing', NavIcon: CreditCard },
    { id: 'security', label: 'Security',       NavIcon: Shield    },
  ];

  return (
    <div>
      <Nav />
      <main id="main-content" style={{ minHeight: '100vh', background: 'var(--gray-50)', padding: '40px max(24px, calc(50% - 640px))' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32, alignItems: 'start' }}>
          {/* Sidebar nav */}
          <nav style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 14, overflow: 'hidden' }}>
            {navItems.map((navItem) => {
              const NavItemIcon = navItem.NavIcon;
              return (
                <button
                  key={navItem.id}
                  style={{
                    width: '100%', padding: '13px 16px', textAlign: 'left',
                    background: section === navItem.id ? '#f5f4fd' : 'none', border: 'none',
                    borderLeft: `3px solid ${section === navItem.id ? 'var(--prn-primary)' : 'transparent'}`,
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontSize: 14, fontWeight: section === navItem.id ? 600 : 500,
                    color: section === navItem.id ? 'var(--prn-primary)' : 'var(--gray-700)',
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                  onClick={() => setSection(navItem.id)}
                  aria-current={section === navItem.id ? 'page' : undefined}
                >
                  <NavItemIcon size={15} />
                  {navItem.label}
                </button>
              );
            })}
            <div className="divider" />
            <button
              style={{ width: '100%', padding: '13px 16px', textAlign: 'left', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#dc2626', cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={handleLogout}
            >
              <LogOut size={15} />
              Sign out
            </button>
          </nav>

          {/* Content */}
          <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 14, padding: 28 }}>
            {section === 'profile' && (
              <>
                <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Profile</h1>
                <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 28 }}>Update your personal information.</p>

                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--prn-primary), var(--prn-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 700, flexShrink: 0 }}>
                    {(user.name || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{user.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>{user.email}</div>
                    <div style={{ marginTop: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: user.plan === 'pro' ? 'linear-gradient(135deg, var(--prn-primary), var(--prn-accent))' : 'var(--gray-100)', color: user.plan === 'pro' ? '#fff' : 'var(--gray-500)' }}>
                        {user.plan === 'pro' ? 'PRN Pro' : 'Free plan'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="auth-form" style={{ maxWidth: 460 }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="acc-name">Full name</label>
                    <input id="acc-name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="acc-email">Email</label>
                    <input id="acc-email" type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={handleSave}>
                    {saved ? '✓ Saved' : 'Save changes'}
                  </button>
                </div>
              </>
            )}

            {section === 'billing' && (
              <>
                <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Plan & Billing</h1>
                <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 28 }}>Manage your subscription.</p>

                <div style={{ padding: 20, background: user.plan === 'pro' ? 'linear-gradient(145deg, #f5f4fd, #fff5fb)' : 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 12, marginBottom: 24 }}>
                  <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>
                    {user.plan === 'pro' ? 'PRN Pro' : 'Free Plan'}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 16 }}>
                    {user.plan === 'pro'
                      ? 'You have access to all Pro features.'
                      : 'You are on the free plan. Up to 5 active projects, basic templates, PNG & JPG export.'}
                  </div>
                  {user.plan !== 'pro' && (
                    <Link to="/pricing" className="btn btn-primary btn-sm">Upgrade to PRN Pro</Link>
                  )}
                </div>

                <p style={{ fontSize: 13, color: 'var(--gray-400)', lineHeight: 1.6 }}>
                  Payment processing is handled securely. Raw card details are never stored on our servers.
                  For billing support, contact <a href="mailto:hello@prn.design" style={{ color: 'var(--prn-primary)' }}>hello@prn.design</a>.
                </p>
              </>
            )}

            {section === 'security' && (
              <>
                <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Security</h1>
                <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 28 }}>Manage your account security.</p>

                <div style={{ padding: 20, background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 12, marginBottom: 16 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Password</div>
                  <div style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 12 }}>
                    To change your password, sign out and use the "Forgot password" option on the sign-in page.
                  </div>
                </div>

                <div style={{ padding: 20, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6, color: '#dc2626' }}>Delete account</div>
                  <div style={{ fontSize: 14, color: '#991b1b', marginBottom: 12 }}>
                    Permanently delete your account and all your designs. This cannot be undone.
                  </div>
                  <a href="mailto:hello@prn.design?subject=Delete my account" className="btn btn-danger btn-sm">
                    Request account deletion
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountPage;
