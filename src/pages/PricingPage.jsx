import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, X, ArrowRight } from 'lucide-react';
import Nav from '../components/shared/Nav';
import Footer from '../components/shared/Footer';

const FREE_FEATURES = [
  ['Core canvas editor', true],
  ['Text, shapes, images', true],
  ['Basic templates (starter set)', true],
  ['PNG & JPG export', true],
  ['Up to 5 active projects', true],
  ['Basic image upload (up to 10 MB)', true],
  ['Multi-page documents', true],
  ['PDF export', false],
  ['High-resolution export (2×)', false],
  ['Premium templates', false],
  ['Brand Kit', false],
  ['Background removal', false],
  ['Unlimited projects', false],
  ['Extended version history', false],
  ['Priority support', false],
];

const PRO_FEATURES = FREE_FEATURES.map(([f]) => [f, true]);

const FAQ = [
  {
    q: 'Can I cancel at any time?',
    a: 'Yes. You can cancel your PRN Pro subscription at any time. Your access continues until the end of the billing period.',
  },
  {
    q: 'Do I lose my designs if I downgrade to Free?',
    a: 'No. All your designs are retained. You will lose access to Pro-only features, and designs over the 5-project limit will become read-only until you free up space.',
  },
  {
    q: 'Is a credit card required for the free plan?',
    a: 'No. You can create a free account and use PRN without a credit card.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'PRN Pro accepts major credit and debit cards. Payment processing is handled securely. Raw card details are never stored on our servers.',
  },
  {
    q: 'Do you offer team or education plans?',
    a: 'Team and education plans are in development. If you are interested, contact us and we will notify you when they are available.',
  },
  {
    q: 'What is background removal?',
    a: 'Background removal is an AI-powered tool that automatically removes the background from photos. It is available on the Pro plan. This feature requires an external processing service.',
  },
];

const PricingPage = () => {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const monthlyPrice = 9;
  const annualPrice  = 7;
  const displayPrice = annual ? annualPrice : monthlyPrice;

  return (
    <div>
      <Nav />
      <main id="main-content">
        {/* Hero */}
        <section className="page-section" style={{ textAlign: 'center', background: 'linear-gradient(160deg, #f7f7fe, #fff5fb)' }}>
          <div className="section-eyebrow">Transparent pricing</div>
          <h1 className="section-title" style={{ margin: '0 auto 16px' }}>Simple, honest pricing</h1>
          <p className="section-subtitle" style={{ margin: '0 auto 32px', textAlign: 'center' }}>
            Start free. Upgrade when you need more.
          </p>

          {/* Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 48 }}>
            <span style={{ fontSize: 14, color: !annual ? 'var(--gray-900)' : 'var(--gray-400)', fontWeight: !annual ? 700 : 400 }}>Monthly</span>
            <button
              role="switch"
              aria-checked={annual}
              aria-label="Toggle annual billing"
              style={{
                width: 48, height: 26, borderRadius: 13,
                background: annual ? 'var(--prn-primary)' : 'var(--gray-200)',
                border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
              }}
              onClick={() => setAnnual(!annual)}
            >
              <span style={{
                position: 'absolute', width: 20, height: 20, background: '#fff',
                borderRadius: '50%', top: 3, left: annual ? 25 : 3,
                transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
            </button>
            <span style={{ fontSize: 14, color: annual ? 'var(--gray-900)' : 'var(--gray-400)', fontWeight: annual ? 700 : 400 }}>
              Annual <span style={{ background: '#ecfdf5', color: '#059669', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700, marginLeft: 4 }}>Save 22%</span>
            </span>
          </div>

          {/* Cards */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 800, margin: '0 auto' }}>
            {/* Free */}
            <div className="card" style={{ flex: '1 1 320px', maxWidth: 360, padding: 32, textAlign: 'left', borderRadius: 20 }}>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Free</div>
              <div style={{ fontSize: 40, fontWeight: 900, marginBottom: 4 }}>$0<span style={{ fontSize: 16, fontWeight: 400, color: 'var(--gray-400)' }}>/mo</span></div>
              <div style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--gray-100)' }}>
                For individuals getting started.
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {FREE_FEATURES.map(([feat, included]) => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: included ? 'var(--gray-700)' : 'var(--gray-300)' }}>
                    {included ? <CheckCircle2 size={14} color="#10b981" /> : <X size={14} />}
                    {feat}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="card" style={{ flex: '1 1 320px', maxWidth: 360, padding: 32, textAlign: 'left', borderRadius: 20, background: 'linear-gradient(145deg, #f5f4fd, #fff5fb)', borderColor: '#c4c0f0', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -12, right: 20 }} className="badge badge-pro">PRO</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>PRN Pro</div>
              <div style={{ fontSize: 40, fontWeight: 900, marginBottom: 4 }}>
                ${displayPrice}
                <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--gray-400)' }}>/{annual ? 'mo, billed annually' : 'mo'}</span>
              </div>
              <div style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--gray-100)' }}>
                For creators who need more.
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {PRO_FEATURES.map(([feat]) => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--gray-700)' }}>
                    <CheckCircle2 size={14} color="#10b981" />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Start PRN Pro
                <ArrowRight size={14} />
              </Link>
              <p style={{ fontSize: 11, color: 'var(--gray-400)', textAlign: 'center', marginTop: 12 }}>
                Cancel anytime. No hidden fees.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="page-section" style={{ background: '#fff', maxWidth: 720, margin: '0 auto' }}>
          <div className="section-eyebrow">Got questions?</div>
          <h2 className="section-title" style={{ marginBottom: 40 }}>Frequently asked questions</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQ.map((item, i) => (
              <div key={i} style={{ border: '1px solid var(--gray-200)', borderRadius: 12, overflow: 'hidden' }}>
                <button
                  style={{ width: '100%', padding: '16px 20px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 15, fontWeight: 600, color: 'var(--gray-800)', fontFamily: 'inherit' }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  {item.q}
                  <span style={{ fontSize: 20, color: 'var(--gray-400)', transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 16px', fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.6 }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
