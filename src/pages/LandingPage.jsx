/**
 * PRN Landing Page — Original Design
 * Brand: Deep Ink / Warm Ivory / Electric Lime / Coral
 */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, Zap, Layers, Type, Image, Download,
  Palette, Layout, PenTool, Shield, Sparkles, ChevronRight,
} from 'lucide-react';
import Nav from '../components/shared/Nav';
import Footer from '../components/shared/Footer';
import './LandingPage.css';

// ── Hero ─────────────────────────────────────────────────
const Hero = () => (
  <section className="lp-hero" aria-labelledby="hero-title">
    <div className="lp-hero-inner">
      <div className="lp-hero-content">
        <div className="lp-hero-badge">
          <Zap size={12} fill="currentColor" />
          Professional design tools. Free to start.
        </div>

        <h1 id="hero-title" className="lp-hero-title">
          Create designs that<br />
          <span className="lp-hero-accent">actually stand out.</span>
        </h1>

        <p className="lp-hero-sub">
          PRN is a professional creative studio built for creators, marketers,
          students, and businesses. Design, export, and publish — without the
          complexity of traditional tools.
        </p>

        <div className="lp-hero-actions">
          <Link to="/signup" className="btn btn-primary btn-lg lp-cta-btn">
            Start designing free
            <ArrowRight size={16} />
          </Link>
          <Link to="/templates" className="btn btn-secondary btn-lg">
            Browse templates
          </Link>
        </div>

        <ul className="lp-hero-trust" role="list">
          {['No credit card', 'Free plan always available', 'Export PNG, JPG, PDF, SVG'].map((t) => (
            <li key={t}>
              <CheckCircle2 size={13} />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="lp-hero-visual" aria-hidden="true">
        <div className="lp-workbench">
          {/* Fake toolbar */}
          <div className="lp-wb-bar">
            <span className="lp-wb-logo">PRN</span>
            <span className="lp-wb-title">Brand Campaign 2026</span>
            <div className="lp-wb-pill">Export</div>
          </div>
          {/* Fake body */}
          <div className="lp-wb-body">
            {/* Fake dock */}
            <div className="lp-wb-dock">
              {['⬡','T','⬜','🖼','📄','◫'].map((ic, i) => (
                <div key={i} className={`lp-wb-dock-btn ${i === 0 ? 'active' : ''}`}>{ic}</div>
              ))}
            </div>
            {/* Fake canvas */}
            <div className="lp-wb-canvas">
              <div className="lp-canvas-card lp-card-1">
                <div className="lp-canvas-accent-bar" />
                <div className="lp-canvas-title">DESIGN<br />ANYTHING.</div>
                <div className="lp-canvas-sub">PRN Creative Studio</div>
              </div>
              <div className="lp-canvas-card lp-card-2">
                <div className="lp-canvas-circle" />
                <div className="lp-canvas-text-sm">Marketing Report Q4</div>
              </div>
              <div className="lp-canvas-sel-box" />
            </div>
            {/* Fake inspector */}
            <div className="lp-wb-inspector">
              <div className="lp-insp-head">Properties</div>
              {[
                { label: 'X', val: '120' }, { label: 'Y', val: '80' },
                { label: 'W', val: '480' }, { label: 'H', val: '320' },
              ].map(({ label, val }) => (
                <div key={label} className="lp-insp-row">
                  <span className="lp-insp-lbl">{label}</span>
                  <span className="lp-insp-val">{val}</span>
                </div>
              ))}
              <div className="lp-insp-color">
                <span>Fill</span>
                <div className="lp-insp-swatch" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ── Platforms strip ───────────────────────────────────────
const PlatformsStrip = () => (
  <section className="lp-platforms" aria-label="Design for any platform">
    <span className="lp-platforms-label">Design for</span>
    {['Instagram','YouTube','LinkedIn','Twitter/X','Presentations','Print & PDF','Facebook','TikTok'].map((n) => (
      <span key={n} className="lp-platform-tag">{n}</span>
    ))}
  </section>
);

// ── Features ──────────────────────────────────────────────
const FEATURES = [
  { Icon: PenTool,    title: 'Full Canvas Editor',      desc: 'Precise drag-and-drop design with shapes, text, images, alignment tools, layers, and z-order control.',   tag: 'Free' },
  { Icon: Type,       title: 'Typography Studio',        desc: 'Multiple fonts, precise size/weight/spacing controls, text effects, and real-time inline editing.',        tag: 'Free' },
  { Icon: Image,      title: 'Image Editing',            desc: 'Upload PNG, JPG, GIF, WebP, SVG. Crop, resize, flip, rotate, and adjust opacity directly on the canvas.', tag: 'Free' },
  { Icon: Layout,     title: 'Editable Templates',       desc: '10 original starter templates with real design content — not just colored boxes. More being added.',      tag: 'Free' },
  { Icon: Layers,     title: 'Layers & Multi-Page',      desc: 'Full layer management with visibility, locking, and z-order. Build multi-page documents in one file.',     tag: 'Free' },
  { Icon: Download,   title: 'Multi-Format Export',      desc: 'PNG, JPG, PDF (all pages), SVG. High-resolution output. Meaningful filenames. No watermarks.',            tag: 'Free' },
  { Icon: Palette,    title: 'Color & Brand Control',    desc: 'Full color picker, hex input, brand color palette, background color control, and fill/stroke editing.',   tag: 'Free' },
  { Icon: Shield,     title: 'Local-First & Private',    desc: 'Designs are stored in your browser. Private by default. No external data transmission without your action.', tag: 'Free' },
  { Icon: Sparkles,   title: 'AI Tools (Coming Soon)',   desc: 'Prompt-to-image, caption writing, and background removal — planned with real API integrations.',           tag: 'Pro Soon' },
];

const tagStyle = {
  'Free':     { background: 'var(--prn-lime)', color: '#0d0e14' },
  'Pro Soon': { background: 'rgba(155,142,244,0.15)', color: 'var(--prn-violet)', border: '1px solid rgba(155,142,244,0.3)' },
};

const FeaturesSection = () => (
  <section className="page-section lp-features" aria-labelledby="feat-title">
    <div className="section-eyebrow">What's inside PRN</div>
    <h2 id="feat-title" className="section-title">Built for real work.</h2>
    <p className="section-subtitle">
      Every tool you need to create professional designs — without learning 20 shortcut menus.
    </p>
    <div className="lp-feat-grid">
      {FEATURES.map((f) => {
        const FIcon = f.Icon;
        return (
          <div key={f.title} className="lp-feat-card">
            <div className="lp-feat-icon">
              <FIcon size={20} />
            </div>
            <div>
              <div className="lp-feat-title">
                {f.title}
                <span className="lp-feat-tag" style={tagStyle[f.tag] || {}}>{f.tag}</span>
              </div>
              <p className="lp-feat-desc">{f.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

// ── Steps ─────────────────────────────────────────────────
const STEPS = [
  { n: '01', title: 'Start from a template or blank canvas', body: 'Pick from a curated starter collection or open a custom-sized blank canvas. Every template contains real editable design content.' },
  { n: '02', title: 'Edit with full creative control',       body: 'Add shapes, text, and images. Adjust colors, fonts, layers, and spacing. Preview every change in real time.' },
  { n: '03', title: 'Export and publish your work',          body: 'Download as PNG, JPG, PDF, or SVG — all pages, high resolution, no watermarks. Your file is ready to share immediately.' },
];

const StepsSection = () => (
  <section className="page-section lp-steps-section" aria-labelledby="steps-title">
    <div className="section-eyebrow">Simple workflow</div>
    <h2 id="steps-title" className="section-title">From blank to done.</h2>
    <div className="lp-steps">
      {STEPS.map((s) => (
        <div key={s.n} className="lp-step">
          <div className="lp-step-num">{s.n}</div>
          <h3 className="lp-step-title">{s.title}</h3>
          <p className="lp-step-body">{s.body}</p>
        </div>
      ))}
    </div>
  </section>
);

// ── Pricing teaser ────────────────────────────────────────
const PricingTeaser = () => (
  <section className="page-section lp-pricing" aria-labelledby="lp-pricing-title">
    <div className="section-eyebrow">Transparent pricing</div>
    <h2 id="lp-pricing-title" className="section-title">Free by default. Pro when you need it.</h2>

    <div className="lp-pricing-grid">
      <div className="lp-pricing-card">
        <div className="lp-pricing-plan">Free</div>
        <div className="lp-pricing-price">$0 <span>/ month</span></div>
        <p className="lp-pricing-desc">Genuinely useful. Not a limited trial.</p>
        <ul className="lp-pricing-list" role="list">
          {['Core canvas editor','All shapes and text tools','Image upload','Starter templates','PNG & JPG export','Up to 5 saved projects'].map((f) => (
            <li key={f}><CheckCircle2 size={13} />{f}</li>
          ))}
        </ul>
        <Link to="/signup" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
          Create free account
        </Link>
      </div>

      <div className="lp-pricing-card lp-pricing-card--pro">
        <div className="lp-pricing-badge badge badge-pro">PRO</div>
        <div className="lp-pricing-plan">PRN Pro</div>
        <div className="lp-pricing-price">$9 <span>/ month</span></div>
        <p className="lp-pricing-desc">For creators who need more control.</p>
        <ul className="lp-pricing-list" role="list">
          {['Everything in Free','PDF export (all pages)','High-resolution export','All templates','Unlimited projects','Brand Kit','Background removal (AI)','Priority support'].map((f) => (
            <li key={f}><CheckCircle2 size={13} />{f}</li>
          ))}
        </ul>
        <Link to="/pricing" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          See full pricing
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  </section>
);

// ── CTA ───────────────────────────────────────────────────
const CTASection = () => (
  <section className="lp-cta" aria-labelledby="lp-cta-title">
    <div className="lp-cta-inner">
      <h2 id="lp-cta-title" className="lp-cta-title">
        Your next great design starts here.
      </h2>
      <p className="lp-cta-sub">
        Free to start. No credit card. No tutorials required.
      </p>
      <Link to="/signup" className="btn btn-primary btn-xl lp-cta-action">
        Start designing free
        <ArrowRight size={18} />
      </Link>
    </div>
  </section>
);

// ── Page ──────────────────────────────────────────────────
const LandingPage = () => (
  <div className="lp-page">
    <Nav />
    <main id="main-content">
      <Hero />
      <PlatformsStrip />
      <FeaturesSection />
      <StepsSection />
      <PricingTeaser />
      <CTASection />
    </main>
    <Footer />
  </div>
);

export default LandingPage;
