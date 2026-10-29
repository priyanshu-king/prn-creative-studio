import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Zap, Shield, Heart } from 'lucide-react';
import Nav from '../components/shared/Nav';
import Footer from '../components/shared/Footer';

const values = [
  { icon: <Target size={22} />, title: 'Simplicity first', desc: 'Design tools should be powerful without being overwhelming. We make complex design accessible to everyone.' },
  { icon: <Zap size={22} />, title: 'Speed matters', desc: 'A fast, responsive editor is not optional. Every interaction should feel immediate and fluid.' },
  { icon: <Shield size={22} />, title: 'Honesty', desc: 'We are transparent about what PRN can and cannot do. No inflated claims, no fake social proof.' },
  { icon: <Heart size={22} />, title: 'Built for creators', desc: 'PRN exists to serve the people who make things — students, freelancers, businesses, and everyday creators.' },
];

const AboutPage = () => (
  <div>
    <Nav />
    <main id="main-content">
      {/* Hero */}
      <section className="page-section" style={{ background: 'linear-gradient(160deg, #f7f7fe, #fff5fb)', paddingBottom: 60 }}>
        <div className="section-eyebrow">About PRN</div>
        <h1 className="section-title" style={{ maxWidth: 640 }}>
          A design platform built with purpose.
        </h1>
        <p className="section-subtitle" style={{ maxWidth: 600 }}>
          PRN is a creative design platform for people who want to make great things without spending weeks learning design software. We believe professional-quality design should be accessible to everyone.
        </p>
      </section>

      {/* Mission */}
      <section className="page-section" style={{ background: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div className="section-eyebrow">Our mission</div>
            <h2 className="section-title" style={{ fontSize: 32, marginBottom: 20 }}>Make great design accessible</h2>
            <p style={{ fontSize: 16, color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: 16 }}>
              Great visual communication should not require a design degree, expensive software, or years of experience. PRN gives creators, students, marketers, and businesses a practical tool to design confidently and export professionally.
            </p>
            <p style={{ fontSize: 16, color: 'var(--gray-500)', lineHeight: 1.7 }}>
              We are building PRN honestly — starting with a genuinely useful core, being transparent about limitations, and expanding features based on what users actually need.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {values.map((v) => (
              <div key={v.title} style={{ display: 'flex', gap: 16, padding: 20, background: 'var(--gray-50)', borderRadius: 12, border: '1px solid var(--gray-100)' }}>
                <div style={{ width: 44, height: 44, background: '#eeedf8', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--prn-primary)', flexShrink: 0 }}>
                  {v.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{v.title}</div>
                  <div style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.6 }}>{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-section" style={{ background: 'var(--gray-50)', textAlign: 'center' }}>
        <h2 className="section-title" style={{ margin: '0 auto 16px' }}>Start creating today</h2>
        <p style={{ fontSize: 16, color: 'var(--gray-500)', marginBottom: 28 }}>Free to start. No credit card required.</p>
        <Link to="/signup" className="btn btn-primary btn-lg">Create your free account <ArrowRight size={16} /></Link>
      </section>
    </main>
    <Footer />
  </div>
);

export default AboutPage;
