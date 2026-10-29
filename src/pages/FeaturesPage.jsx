import React from 'react';
import { Link } from 'react-router-dom';
import {
  PenTool, Layout, Palette, Download, Layers, Type, Image,
  Zap, Share2, Lock, FileText, Sparkles, ArrowRight, CheckCircle2,
} from 'lucide-react';
import Nav from '../components/shared/Nav';
import Footer from '../components/shared/Footer';

const FEATURE_SECTIONS = [
  {
    icon: <PenTool size={28} />,
    title: 'Powerful Canvas Editor',
    desc: 'A full-featured drag-and-drop canvas that runs entirely in your browser. No downloads, no plugins. Add shapes, text, images, and icons. Select, move, resize, rotate, and group objects with precision.',
    bullets: ['Drag-and-drop design', 'Multi-selection and grouping', 'Alignment guides and snapping', 'Keyboard shortcuts'],
    tag: 'Free',
  },
  {
    icon: <Type size={28} />,
    title: 'Typography Controls',
    desc: 'Full control over your text. Choose from multiple font families, set size, weight, style, alignment, and line height. Edit directly on the canvas.',
    bullets: ['Multiple font families', 'Bold, italic, underline', 'Text alignment and line height', 'Font size from 6px to 500px'],
    tag: 'Free',
  },
  {
    icon: <Image size={28} />,
    title: 'Image Editing',
    desc: 'Upload images from your device and place them on the canvas. Scale, reposition, flip, rotate, and adjust opacity. Supports PNG, JPG, GIF, WebP, and SVG.',
    bullets: ['Upload from device', 'Scale and reposition', 'Flip horizontal and vertical', 'Opacity and layering'],
    tag: 'Free',
  },
  {
    icon: <Layout size={28} />,
    title: 'Templates',
    desc: 'A starter collection of original templates for the most common design formats. Open any template, customise it, and make it yours. More templates added regularly.',
    bullets: ['Social media formats', 'Presentations and pitch decks', 'Print and marketing materials', 'Resumes, flyers, and more'],
    tag: 'Free',
  },
  {
    icon: <Layers size={28} />,
    title: 'Layers & Pages',
    desc: 'Manage complex designs with confidence. The layers panel shows every object, lets you reorder them, and controls visibility. Multi-page documents let you build full decks and reports.',
    bullets: ['Layers panel with visibility toggle', 'Object reordering', 'Multi-page documents', 'Page thumbnails'],
    tag: 'Free',
  },
  {
    icon: <Download size={28} />,
    title: 'Export & Download',
    desc: 'Export your design as PNG, JPG, PDF, or SVG. High-resolution export at 2× scale ensures crisp results for both screen and print. Meaningful filenames, no watermarks.',
    bullets: ['PNG (transparent background)', 'JPG (optimised for sharing)', 'PDF (multi-page support)', 'SVG (vector shapes)'],
    tag: 'Free + Pro',
  },
  {
    icon: <Palette size={28} />,
    title: 'Brand Kit',
    desc: 'Save your brand colors, fonts, and logos in the Brand Kit. Apply them to any design with one click. Keep your visual identity consistent across all your work.',
    bullets: ['Saved brand colors', 'Saved font choices', 'Logo storage', 'Apply to any design'],
    tag: 'Pro',
  },
  {
    icon: <Zap size={28} />,
    title: 'Undo / Redo & Autosave',
    desc: 'Never lose work. Full undo/redo history lets you step back through every change. Autosave stores your design every few seconds so progress is never lost.',
    bullets: ['Full undo/redo history', 'Autosave every 3 seconds', 'Manual save with Ctrl+S', 'Unsaved change indicator'],
    tag: 'Free',
  },
  {
    icon: <Sparkles size={28} />,
    title: 'AI Tools (Coming Soon)',
    desc: 'AI-assisted design features are in development, including image generation, caption writing, and layout suggestions. These features require external API credentials and will be clearly marked when available.',
    bullets: ['AI image generation', 'Caption and headline writing', 'Background removal (AI)', 'Layout suggestions'],
    tag: 'Coming Soon',
  },
];

const tagColor = (tag) => ({
  'Free':       { background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' },
  'Pro':        { background: 'linear-gradient(135deg, var(--prn-primary), var(--prn-accent))', color: '#fff', border: 'none' },
  'Free + Pro': { background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' },
  'Coming Soon':{ background: '#fef9c3', color: '#713f12', border: '1px solid #fde68a' },
}[tag] || {});

const FeaturesPage = () => (
  <div>
    <Nav />
    <main id="main-content">
      {/* Hero */}
      <section className="page-section" style={{ textAlign: 'center', background: 'linear-gradient(160deg, #f7f7fe, #fff5fb)', paddingBottom: 48 }}>
        <div className="section-eyebrow">What's inside PRN</div>
        <h1 className="section-title" style={{ margin: '0 auto 16px' }}>A complete creative toolkit</h1>
        <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center', maxWidth: 600 }}>
          Every tool you need to create professional designs — for social media, presentations, print, and beyond.
        </p>
        <div style={{ marginTop: 28 }}>
          <Link to="/signup" className="btn btn-primary btn-lg">Start designing free <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* Features */}
      <section className="page-section" style={{ background: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 28 }}>
          {FEATURE_SECTIONS.map((f) => (
            <div key={f.title} className="card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #eeedf8, #fdf0f8)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--prn-primary)' }}>
                  {f.icon}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, ...tagColor(f.tag) }}>{f.tag}</span>
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: 'var(--gray-900)' }}>{f.title}</h2>
              <p style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.65, marginBottom: 16 }}>{f.desc}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {f.bullets.map((b) => (
                  <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--gray-700)' }}>
                    <CheckCircle2 size={13} color="#10b981" flexShrink={0} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default FeaturesPage;
