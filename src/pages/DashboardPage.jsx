import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, Search, MoreHorizontal, Trash2, Copy,
  Pencil, LogOut, User, Clock, LayoutGrid,
} from 'lucide-react';
import useAppStore, { CANVAS_PRESETS } from '../store/useAppStore';
import Nav from '../components/shared/Nav';

// ── New Design Modal ──────────────────────────────────────
const NewDesignModal = ({ onClose, onCreate }) => {
  const [selectedPreset, setSelectedPreset] = useState(CANVAS_PRESETS[0]);
  const [title, setTitle] = useState('Untitled Design');
  const [customW, setCustomW] = useState(800);
  const [customH, setCustomH] = useState(600);

  const handleCreate = () => {
    const preset = selectedPreset.id === 'custom'
      ? { ...selectedPreset, width: parseInt(customW) || 800, height: parseInt(customH) || 600 }
      : selectedPreset;
    onCreate({ title: title.trim() || 'Untitled Design', preset: preset.id, width: preset.width, height: preset.height });
    onClose();
  };

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="new-design-title" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 600 }}>
        <div className="modal-header">
          <h2 id="new-design-title" className="modal-title">New Design</h2>
          <button className="btn btn-icon" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="design-title">Design title</label>
            <input
              id="design-title"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer Campaign Post"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Canvas size</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
              {CANVAS_PRESETS.map((p) => (
                <button
                  key={p.id}
                  className={`export-format-btn ${selectedPreset.id === p.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPreset(p)}
                  style={{ textAlign: 'center', padding: '12px 8px' }}
                >
                  <div style={{ fontWeight: 700, fontSize: 12 }}>{p.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 400, color: 'var(--gray-400)', marginTop: 2 }}>
                    {p.width}×{p.height}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedPreset.id === 'custom' && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Width (px)</label>
                <input className="form-input" type="number" min={100} max={8000} value={customW} onChange={(e) => setCustomW(e.target.value)} />
              </div>
              <div style={{ color: 'var(--gray-400)', marginTop: 22 }}>×</div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Height (px)</label>
                <input className="form-input" type="number" min={100} max={8000} value={customH} onChange={(e) => setCustomH(e.target.value)} />
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate}>Create design</button>
        </div>
      </div>
    </div>
  );
};

// ── Project Card ──────────────────────────────────────────
const ProjectCard = ({ project, onOpen, onDelete, onDuplicate, onRename }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(project.title);

  const fmt = (ts) => new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  const handleRename = () => {
    if (newTitle.trim()) onRename(project.id, newTitle.trim());
    setRenaming(false);
    setMenuOpen(false);
  };

  return (
    <div className="project-card" onClick={() => !menuOpen && !renaming && onOpen(project.id)}>
      <div className="project-card-thumb">
        {project.thumbnail
          ? <img src={project.thumbnail} alt={`${project.title} preview`} />
          : <LayoutGrid size={36} color="var(--gray-200)" />
        }
        {/* Menu */}
        <div className="project-card-menu" onClick={(e) => e.stopPropagation()}>
          <button
            className="btn btn-icon btn-sm"
            style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', border: '1px solid var(--gray-200)' }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Project options"
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <div
              role="menu"
              style={{
                position: 'absolute', top: 36, right: 0, background: '#fff',
                border: '1px solid var(--gray-200)', borderRadius: 10,
                boxShadow: 'var(--shadow-lg)', minWidth: 160, zIndex: 50,
                padding: 4,
              }}
            >
              <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start', gap: 8 }} role="menuitem"
                onClick={() => { setRenaming(true); setMenuOpen(false); }}>
                <Pencil size={14} /> Rename
              </button>
              <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start', gap: 8 }} role="menuitem"
                onClick={() => { onDuplicate(project.id); setMenuOpen(false); }}>
                <Copy size={14} /> Duplicate
              </button>
              <div className="divider" style={{ margin: '4px 0' }} />
              <button className="btn btn-sm" style={{ width: '100%', justifyContent: 'flex-start', gap: 8, color: '#dc2626', background: 'transparent' }} role="menuitem"
                onClick={() => { onDelete(project.id); setMenuOpen(false); }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="project-card-info" onClick={(e) => e.stopPropagation()}>
        {renaming ? (
          <input
            autoFocus
            className="form-input"
            style={{ fontSize: 13, padding: '4px 8px' }}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setRenaming(false); }}
          />
        ) : (
          <div className="project-card-title" onClick={() => onOpen(project.id)}>{project.title}</div>
        )}
        <div className="project-card-meta" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={10} />
          <span>{fmt(project.updatedAt)}</span>
          <span style={{ margin: '0 4px' }}>·</span>
          <span>{project.width}×{project.height}</span>
        </div>
      </div>
    </div>
  );
};

// ── Dashboard Page ────────────────────────────────────────
const DashboardPage = () => {
  const user          = useAppStore((s) => s.user);
  const projects      = useAppStore((s) => s.projects);
  const createNewProject = useAppStore((s) => s.createNewProject);
  const deleteProject = useAppStore((s) => s.deleteProject);
  const duplicateProject = useAppStore((s) => s.duplicateProject);
  const updateProject = useAppStore((s) => s.updateProject);
  const navigate = useNavigate();

  const [search,      setSearch]      = useState('');
  const [showNew,     setShowNew]     = useState(false);

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (opts) => {
    const proj = createNewProject(opts);
    navigate(`/editor/${proj.id}`);
  };

  const handleOpen = (id) => navigate(`/editor/${id}`);

  return (
    <div className="dashboard-layout">
      <Nav />

      <main className="dashboard-body" id="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            {user ? `Welcome back, ${user.name.split(' ')[0]}` : 'My Designs'}
          </h1>
          <p className="dashboard-subtitle">All your designs in one place.</p>
        </div>

        <div className="dashboard-toolbar">
          <button className="btn btn-primary" onClick={() => setShowNew(true)}>
            <Plus size={16} />
            New design
          </button>

          <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' }} />
            <input
              className="form-input"
              style={{ paddingLeft: 36, width: '100%' }}
              placeholder="Search designs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search designs"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-400)' }}>
            {projects.length === 0 ? (
              <>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎨</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 8 }}>
                  No designs yet
                </div>
                <div style={{ fontSize: 15, marginBottom: 24 }}>
                  Create your first design to get started.
                </div>
                <button className="btn btn-primary btn-lg" onClick={() => setShowNew(true)}>
                  <Plus size={18} /> Create your first design
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-600)' }}>
                  No designs match "{search}"
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="project-grid">
            {/* New design shortcut */}
            <button className="new-project-card" onClick={() => setShowNew(true)} aria-label="Create new design">
              <Plus size={28} />
              <span className="new-project-card-label">New design</span>
            </button>

            {filtered.map((proj) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                onOpen={handleOpen}
                onDelete={deleteProject}
                onDuplicate={duplicateProject}
                onRename={(id, title) => updateProject(id, { title })}
              />
            ))}
          </div>
        )}
      </main>

      {showNew && (
        <NewDesignModal
          onClose={() => setShowNew(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default DashboardPage;
