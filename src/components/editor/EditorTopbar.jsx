/**
 * PRN Editor Topbar — Creative Workbench
 * Context-sensitive toolbar: shows alignment/order/group controls when selection exists.
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Undo2, Redo2, Download, ChevronDown, Trash2, ArrowLeft,
  Save, Copy, ZoomIn, ZoomOut, Maximize2,
  AlignLeft, AlignCenter, AlignRight,
  AlignStartVertical, AlignCenterVertical, AlignEndVertical,
  BringToFront, SendToBack, ChevronUp, ChevronDown as ChevronDownLayer, Ungroup, Group,
} from 'lucide-react';

const Topbar = ({
  title, onTitleChange,
  canUndo, canRedo, onUndo, onRedo,
  hasSelection, selectedObj,
  onDelete, onDuplicate,
  onGroup, onUngroup,
  onBringForward, onSendBackward, onBringToFront, onSendToBack,
  onAlignH, onAlignV,
  onExport, onSave,
  zoom, onZoomIn, onZoomOut, onZoomReset, onZoomFit,
  isDirty,
}) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [localTitle,   setLocalTitle]   = useState(title);
  const [showExport,   setShowExport]   = useState(false);
  const exportRef = useRef(null);

  const commitTitle = useCallback(() => {
    setEditingTitle(false);
    if (localTitle.trim()) onTitleChange(localTitle.trim());
    else setLocalTitle(title);
  }, [localTitle, title, onTitleChange]);

  // Close export dropdown on outside click
  useEffect(() => {
    if (!showExport) return;
    const handler = (e) => {
      if (!exportRef.current?.contains(e.target)) setShowExport(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showExport]);

  // Sync local title when project title changes externally
  useEffect(() => { setLocalTitle(title); }, [title]);

  const isGroup = selectedObj?.type === 'group';
  const isMulti = selectedObj?.type === 'activeselection';

  const EXPORTS = [
    { fmt: 'png',  label: 'PNG',  desc: 'Transparent background, lossless' },
    { fmt: 'jpg',  label: 'JPG',  desc: 'Smaller file, best for photos' },
    { fmt: 'pdf',  label: 'PDF',  desc: 'All pages, print-ready' },
    { fmt: 'svg',  label: 'SVG',  desc: 'Vector, scalable' },
  ];

  return (
    <header className="editor-topbar" role="banner">
      {/* Back */}
      <Link to="/dashboard" className="btn btn-icon-dark btn" title="Back to dashboard" aria-label="Back to dashboard" style={{ flexShrink: 0 }}>
        <ArrowLeft size={15} />
      </Link>

      {/* Logo */}
      <span className="editor-topbar-logo" aria-label="PRN">PRN</span>

      {/* Title */}
      {editingTitle ? (
        <input
          autoFocus className="editor-title-input"
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          onBlur={commitTitle}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitTitle();
            if (e.key === 'Escape') { setLocalTitle(title); setEditingTitle(false); }
          }}
          aria-label="Design title"
        />
      ) : (
        <button
          className="editor-title-btn"
          onClick={() => { setLocalTitle(title); setEditingTitle(true); }}
          title="Click to rename"
          aria-label={`Design: ${title}. Click to rename.`}
        >
          {title}
        </button>
      )}

      {/* Save status */}
      {isDirty && (
        <span style={{ fontSize: 10, color: 'var(--editor-text-dim)', flexShrink: 0, marginLeft: 2 }}>
          ●
        </span>
      )}

      {/* ── Context tools (visible when object selected) ─── */}
      {hasSelection && (
        <>
          <div className="editor-topbar-sep" />
          <div className="editor-topbar-group">
            {/* Alignment H */}
            {[
              { fn: () => onAlignH('left'),    Icon: AlignLeft,   label: 'Align left' },
              { fn: () => onAlignH('centerH'),  Icon: AlignCenter, label: 'Align center' },
              { fn: () => onAlignH('right'),   Icon: AlignRight,  label: 'Align right' },
            ].map(({ fn, Icon, label }) => (
              <button key={label} className="btn btn-icon-dark btn" onClick={fn} title={label} aria-label={label}>
                <Icon size={13} />
              </button>
            ))}
            <div className="editor-topbar-sep" />
            {[
              { fn: () => onAlignV('top'),     Icon: AlignStartVertical,  label: 'Align top' },
              { fn: () => onAlignV('centerV'), Icon: AlignCenterVertical, label: 'Align middle' },
              { fn: () => onAlignV('bottom'),  Icon: AlignEndVertical,    label: 'Align bottom' },
            ].map(({ fn, Icon, label }) => (
              <button key={label} className="btn btn-icon-dark btn" onClick={fn} title={label} aria-label={label}>
                <Icon size={13} />
              </button>
            ))}
            <div className="editor-topbar-sep" />
            {/* Z-order */}
            <button className="btn btn-icon-dark btn" onClick={onBringToFront} title="Bring to front" aria-label="Bring to front"><BringToFront size={13} /></button>
            <button className="btn btn-icon-dark btn" onClick={onBringForward}  title="Bring forward" aria-label="Bring forward"><ChevronUp size={13} /></button>
            <button className="btn btn-icon-dark btn" onClick={onSendBackward}  title="Send backward" aria-label="Send backward"><ChevronDownLayer size={13} /></button>
            <button className="btn btn-icon-dark btn" onClick={onSendToBack}    title="Send to back"  aria-label="Send to back"><SendToBack size={13} /></button>
            <div className="editor-topbar-sep" />
            {/* Group / Ungroup */}
            {isMulti && (
              <button className="btn btn-icon-dark btn" onClick={onGroup} title="Group (Ctrl+G)" aria-label="Group objects"><Group size={13} /></button>
            )}
            {isGroup && (
              <button className="btn btn-icon-dark btn" onClick={onUngroup} title="Ungroup (Ctrl+Shift+G)" aria-label="Ungroup"><Ungroup size={13} /></button>
            )}
            {/* Duplicate + Delete */}
            <button className="btn btn-icon-dark btn" onClick={onDuplicate} title="Duplicate (Ctrl+D)" aria-label="Duplicate"><Copy size={13} /></button>
            <button
              className="btn btn-icon-dark btn"
              onClick={onDelete} title="Delete (Del)" aria-label="Delete"
              style={{ color: 'var(--editor-text-muted)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--prn-coral)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--editor-text-muted)'}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </>
      )}

      <div className="editor-topbar-spacer" />

      {/* ── Undo / Redo ─── */}
      <div className="editor-topbar-group">
        <button className="btn btn-icon-dark btn" onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)" aria-label="Undo">
          <Undo2 size={15} />
        </button>
        <button className="btn btn-icon-dark btn" onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)" aria-label="Redo">
          <Redo2 size={15} />
        </button>
      </div>

      <div className="editor-topbar-sep" />

      {/* ── Zoom ─── */}
      <div className="editor-topbar-group">
        <button className="btn btn-icon-dark btn" onClick={onZoomOut} title="Zoom out" aria-label="Zoom out"><ZoomOut size={14} /></button>
        <button className="editor-zoom-value" onClick={onZoomReset} title="Reset zoom" aria-label={`Zoom ${Math.round(zoom * 100)}%`}>
          {Math.round(zoom * 100)}%
        </button>
        <button className="btn btn-icon-dark btn" onClick={onZoomIn} title="Zoom in" aria-label="Zoom in"><ZoomIn size={14} /></button>
        <button className="btn btn-icon-dark btn" onClick={onZoomFit} title="Fit to screen" aria-label="Fit to screen"><Maximize2 size={13} /></button>
      </div>

      <div className="editor-topbar-sep" />

      {/* ── Save ─── */}
      <button
        className="btn btn-dark btn-sm"
        onClick={onSave}
        title="Save (Ctrl+S)"
        aria-label="Save design"
        style={{ gap: 5 }}
      >
        <Save size={13} />
        {isDirty ? 'Save*' : 'Saved'}
      </button>

      {/* ── Export ─── */}
      <div style={{ position: 'relative' }} ref={exportRef}>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowExport(!showExport)}
          aria-haspopup="true" aria-expanded={showExport}
          aria-label="Export design"
        >
          <Download size={13} />
          Export
          <ChevronDown size={11} />
        </button>

        {showExport && (
          <div className="export-dropdown" role="menu" aria-label="Export options">
            {EXPORTS.map(({ fmt, label, desc }) => (
              <button
                key={fmt} role="menuitem" className="export-option"
                onClick={() => { onExport(fmt); setShowExport(false); }}
              >
                <span className="export-option-fmt">{label}</span>
                <span className="export-option-desc">{desc}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
