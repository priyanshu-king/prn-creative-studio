import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import Nav from '../components/shared/Nav';
import Footer from '../components/shared/Footer';

const TOPICS = [
  {
    title: 'Getting Started',
    items: [
      { q: 'How do I create my first design?', a: 'Click "New design" from your dashboard. Choose a canvas size or pick a preset, give it a name, and click "Create design". You will be taken directly to the editor.' },
      { q: 'Do I need an account to use PRN?', a: 'You need a free account to save your designs. Creating an account takes about 30 seconds and does not require a credit card.' },
      { q: 'What canvas sizes are available?', a: 'PRN includes presets for Instagram Posts, Stories, YouTube Thumbnails, Presentations (16:9), A4 Portrait and Landscape, Twitter/X, LinkedIn, Business Cards, and Posters. You can also enter a custom size.' },
    ],
  },
  {
    title: 'Editor',
    items: [
      { q: 'How do I add text?', a: 'Click the "Text" tab in the left panel, then choose from Heading, Subheading, Body Text, or Caption. You can also click a font name to add text in that font. Double-click a text object on the canvas to edit it.' },
      { q: 'How do I change the color of an object?', a: 'Select the object, then use the Fill color control in the Properties panel on the right side. Click the color swatch or enter a hex code.' },
      { q: 'How do I undo a change?', a: 'Press Ctrl+Z (Windows) or Cmd+Z (Mac). You can also use the undo arrow button in the toolbar. Use Ctrl+Y or Ctrl+Shift+Z to redo.' },
      { q: 'How do I select multiple objects?', a: 'Hold Shift and click each object, or click and drag to draw a selection rectangle across objects. Press Ctrl+A to select all.' },
      { q: 'Can I add multiple pages?', a: 'Yes. Open the "Pages" tab in the left panel. Click "Add page" to add a new blank page. You can duplicate or delete pages from the same panel.' },
      { q: 'How do I zoom in and out?', a: 'Use the zoom bar at the bottom of the canvas. Click + and − to zoom, or click "Reset" to fit the canvas to the screen. Arrow keys move selected objects by 1px (or 10px with Shift held).' },
    ],
  },
  {
    title: 'Export & Save',
    items: [
      { q: 'How do I save my design?', a: 'Click the "Save" button in the top bar, or press Ctrl+S. PRN also autosaves every few seconds when you make changes.' },
      { q: 'What export formats are supported?', a: 'PNG, JPG, PDF, and SVG. PNG includes transparency. JPG is smaller for photos. PDF supports multi-page documents. SVG works best for designs made entirely of shapes without complex filters.' },
      { q: 'Is the exported PNG high resolution?', a: 'Yes. Exports render at 2× the canvas pixel dimensions for sharper results when viewed at 100% or printed.' },
    ],
  },
  {
    title: 'Account & Billing',
    items: [
      { q: 'How do I cancel PRN Pro?', a: 'Go to Account settings, then Billing. Click "Cancel subscription". Your Pro access continues until the end of the current billing period.' },
      { q: 'What happens to my designs if I cancel?', a: 'Your designs are always yours. On the free plan, active projects are limited to 5. Designs beyond the limit become read-only until you delete others to free up space.' },
    ],
  },
];

const HelpPage = () => {
  const [search,  setSearch]  = useState('');
  const [openItem, setOpenItem] = useState(null);

  const filtered = TOPICS.map((topic) => ({
    ...topic,
    items: topic.items.filter(
      (item) => !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((t) => t.items.length > 0);

  return (
    <div>
      <Nav />
      <main id="main-content">
        <section className="page-section" style={{ background: 'linear-gradient(160deg, #f7f7fe, #fff5fb)', paddingBottom: 48, textAlign: 'center' }}>
          <div className="section-eyebrow">Help Center</div>
          <h1 className="section-title" style={{ margin: '0 auto 20px' }}>How can we help?</h1>
          <div style={{ position: 'relative', maxWidth: 480, margin: '0 auto' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input
              className="form-input"
              style={{ paddingLeft: 42, borderRadius: 40, fontSize: 15 }}
              placeholder="Search help articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search help"
            />
          </div>
        </section>

        <section className="page-section" style={{ background: '#fff', maxWidth: 760, margin: '0 auto' }}>
          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--gray-400)', fontSize: 15 }}>No results found. Try a different search term.</p>
          ) : filtered.map((topic) => (
            <div key={topic.title} style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: 'var(--gray-900)' }}>{topic.title}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {topic.items.map((item, i) => {
                  const key = `${topic.title}-${i}`;
                  return (
                    <div key={key} style={{ border: '1px solid var(--gray-200)', borderRadius: 10, overflow: 'hidden' }}>
                      <button
                        style={{ width: '100%', padding: '14px 18px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, fontWeight: 600, color: 'var(--gray-800)', fontFamily: 'inherit', gap: 12 }}
                        onClick={() => setOpenItem(openItem === key ? null : key)}
                        aria-expanded={openItem === key}
                      >
                        {item.q}
                        <ChevronDown size={16} style={{ flexShrink: 0, transform: openItem === key ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--gray-400)' }} />
                      </button>
                      {openItem === key && (
                        <div style={{ padding: '0 18px 14px', fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.65, borderTop: '1px solid var(--gray-100)', paddingTop: 12 }}>
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 48, padding: '28px 32px', background: 'var(--gray-50)', borderRadius: 16, border: '1px solid var(--gray-200)', textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Still need help?</div>
            <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 16 }}>
              Can't find what you're looking for? Email us directly.
            </p>
            <a href="mailto:hello@prn.design" className="btn btn-secondary">Contact support</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HelpPage;
