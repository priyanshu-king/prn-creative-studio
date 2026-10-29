/**
 * PRN Templates Page
 * Uses the canonical TEMPLATE_CATALOG from EditorPage so templates
 * actually load real content when opened. The ?template= query param
 * is now read and applied by EditorPage.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import Nav from '../components/shared/Nav';
import Footer from '../components/shared/Footer';
import useAppStore from '../store/useAppStore';
import { TEMPLATE_CATALOG } from '../constants/templates';

const CATEGORIES = ['All', ...Array.from(new Set(TEMPLATE_CATALOG.map((t) => t.category)))];

const TemplatesPage = () => {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const createNewProject = useAppStore((s) => s.createNewProject);
  const navigate = useNavigate();

  const filtered = TEMPLATE_CATALOG.filter((t) => {
    const matchCat = category === 'All' || t.category === category;
    const matchSearch = !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleUse = (template) => {
    const proj = createNewProject({
      title: template.name,
      preset: 'custom',
      width: template.w,
      height: template.h,
    });
    // Pass template ID in query param — EditorPage now reads and applies it
    navigate(`/editor/${proj.id}?template=${template.id}`);
  };

  return (
    <div style={{ background: 'var(--prn-ivory)', minHeight: '100vh' }}>
      <Nav />
      <main id="main-content">
        {/* Hero */}
        <section className="page-section" style={{ background: 'var(--prn-ink)', paddingBottom: 48 }}>
          <div className="section-eyebrow" style={{ color: 'var(--prn-lime)' }}>Ready to use</div>
          <h1 className="section-title" style={{ color: 'var(--prn-ivory)', maxWidth: 600, marginBottom: 12 }}>
            Templates with real design content.
          </h1>
          <p className="section-subtitle" style={{ color: 'var(--ink-5)', marginBottom: 32 }}>
            Every template opens with actual designed content — not an empty canvas. Start faster, customize completely.
          </p>

          <div style={{ position: 'relative', maxWidth: 440, marginBottom: 28 }}>
            <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-5)', pointerEvents: 'none' }} />
            <input
              className="form-input"
              style={{ paddingLeft: 38, borderRadius: 40, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
              placeholder="Search templates…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search templates"
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-dark'}`}
                onClick={() => setCategory(cat)}
                aria-pressed={category === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="page-section" style={{ background: 'var(--prn-ivory)' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-6)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>No templates match your search.</div>
            </div>
          ) : (
            <div className="template-page-grid">
              {filtered.map((t) => (
                <div key={t.id} className="template-page-card card-hover">
                  <div
                    className="template-page-preview"
                    style={{
                      background: t.bg,
                      aspectRatio: t.w / t.h > 1.3 ? '16/9' : t.w === t.h ? '1/1' : t.w < t.h ? '9/16' : '4/3',
                      minHeight: 100,
                    }}
                    aria-hidden="true"
                  >
                    <span>{t.emoji}</span>
                  </div>
                  <div className="template-page-info">
                    <div className="template-page-name">{t.name}</div>
                    <div className="template-page-cat">{t.category} · {t.w}×{t.h}</div>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
                      onClick={() => handleUse(t)}
                    >
                      Use template <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 48, padding: '32px', background: 'var(--prn-ink)', borderRadius: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--prn-ivory)', marginBottom: 8 }}>
              More templates in development
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-4)', marginBottom: 20 }}>
              Can't find what you need? Start from a blank canvas and build your own design.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                const proj = createNewProject({ title: 'Untitled Design', width: 800, height: 600 });
                navigate(`/editor/${proj.id}`);
              }}
            >
              Start with blank canvas <ArrowRight size={14} />
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TemplatesPage;
