/**
 * PRN Creative Workbench — Left Panel
 * Dock + expandable panel: Elements, Text, Images, Templates, Pages, Layers, Background
 *
 * Fixes:
 * - Color swatches now apply color to selected object
 * - Page deletion is fully accessible
 * - Layer ordering controls added
 * - Background color picker implemented
 */
import React, { useRef, useState, useCallback } from 'react';
import {
  Shapes, Type, Image as ImgIcon, LayoutTemplate,
  Layers, FileText, Palette, ChevronDown, ChevronRight,
  Square, Circle, Triangle, Minus, Star, ArrowRight as ArrowRightIcon,
  Hexagon, Maximize2, Eye, EyeOff, Trash2, Copy, ChevronsUp,
  ChevronsDown, ChevronUp, Pencil, Plus, GripVertical,
} from 'lucide-react';
import { TEMPLATE_CATALOG } from '../../constants/templates';
import useAppStore from '../../store/useAppStore';

// ── Brand colors ──────────────────────────────────────────
const BRAND_COLORS = [
  '#0d0e14','#1a1d2e','#3f3f58','#7a7a9a','#f5f2eb',
  '#c8f135','#9b8ef4','#ff5f41','#4fc3f7','#fbbf24',
  '#34d399','#f472b6','#ffffff','#000000',
];

// ── DOCK TABS ─────────────────────────────────────────────
const TABS = [
  { id: 'elements',   label: 'Elements',  Icon: Shapes        },
  { id: 'text',       label: 'Text',      Icon: Type          },
  { id: 'uploads',    label: 'Images',    Icon: ImgIcon       },
  { id: 'templates',  label: 'Templates', Icon: LayoutTemplate},
  { id: 'pages',      label: 'Pages',     Icon: FileText      },
  { id: 'layers',     label: 'Layers',    Icon: Layers        },
  { id: 'background', label: 'Backgrnd',  Icon: Palette       },
];

// ── Elements Panel ────────────────────────────────────────
const SHAPES_CATALOG = [
  { id: 'rect',     label: 'Rect',     Icon: Square        },
  { id: 'rect-r',   label: 'Rounded',  Icon: Square        },
  { id: 'circle',   label: 'Circle',   Icon: Circle        },
  { id: 'ellipse',  label: 'Ellipse',  Icon: Circle        },
  { id: 'triangle', label: 'Triangle', Icon: Triangle      },
  { id: 'line',     label: 'Line',     Icon: Minus         },
  { id: 'arrow',    label: 'Arrow',    Icon: ArrowRightIcon },
  { id: 'star',     label: 'Star',     Icon: Star          },
  { id: 'hexagon',  label: 'Hexagon',  Icon: Hexagon       },
];

const ElementsPanel = ({ onAddShape, canvas, selectedObj }) => {
  const applyColor = useCallback((color) => {
    if (!canvas || !selectedObj) return;
    if (selectedObj.type === 'line') {
      selectedObj.set('stroke', color);
    } else {
      selectedObj.set('fill', color);
    }
    canvas.renderAll();
    canvas.fire('object:modified', { target: selectedObj });
  }, [canvas, selectedObj]);

  return (
    <>
      <div style={{ padding: '10px 12px 4px', fontSize: 10, fontWeight: 700, color: 'var(--editor-text-dim)', letterSpacing: 1, textTransform: 'uppercase' }}>
        Shapes
      </div>
      <div className="shape-grid">
        {SHAPES_CATALOG.map((s) => {
          const ShapeIcon = s.Icon;
          return (
            <button key={s.id} className="shape-btn-item" onClick={() => onAddShape(s.id)} aria-label={`Add ${s.label}`}>
              <ShapeIcon size={18} />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      <div className="divider-dark" style={{ margin: '8px 0' }} />

      <div style={{ padding: '4px 12px 4px', fontSize: 10, fontWeight: 700, color: 'var(--editor-text-dim)', letterSpacing: 1, textTransform: 'uppercase' }}>
        {selectedObj ? 'Apply color to selection' : 'Color palette'}
      </div>
      <div className="color-palette">
        {BRAND_COLORS.map((c) => (
          <button
            key={c}
            className="color-swatch-item"
            style={{ background: c, border: c === '#ffffff' ? '1.5px solid rgba(255,255,255,0.2)' : '1.5px solid transparent' }}
            onClick={() => applyColor(c)}
            title={c}
            aria-label={`Apply color ${c}`}
            disabled={!selectedObj}
          />
        ))}
      </div>
      {!selectedObj && (
        <div style={{ padding: '4px 12px', fontSize: 10.5, color: 'var(--editor-text-dim)', fontStyle: 'italic' }}>
          Select an object to apply a color
        </div>
      )}
    </>
  );
};

// ── Text Panel ────────────────────────────────────────────
const FONTS = [
  'Inter', 'Georgia', 'Arial', 'Verdana', 'Helvetica',
  'Times New Roman', 'Trebuchet MS', 'Courier New',
  'Impact', 'Palatino', 'Garamond', 'Tahoma',
];

const TEXT_PRESETS = [
  { label: 'Heading',     fontSize: 64, fontWeight: '900', text: 'Heading' },
  { label: 'Subheading',  fontSize: 38, fontWeight: '700', text: 'Subheading' },
  { label: 'Body text',   fontSize: 20, fontWeight: '400', text: 'Body text' },
  { label: 'Caption',     fontSize: 14, fontWeight: '400', text: 'Caption text' },
];

const TextPanel = ({ onAddText }) => (
  <>
    <div className="text-preset-list">
      {TEXT_PRESETS.map((p) => (
        <button
          key={p.label}
          className="text-preset-item"
          onClick={() => onAddText({ fontSize: p.fontSize, fontWeight: p.fontWeight, text: p.text })}
          aria-label={`Add ${p.label}`}
          style={{ fontSize: p.label === 'Heading' ? 18 : p.label === 'Subheading' ? 15 : p.label === 'Body text' ? 13 : 11 }}
        >
          <span style={{ fontWeight: p.fontWeight === '900' ? 900 : p.fontWeight === '700' ? 700 : 400 }}>{p.label}</span>
        </button>
      ))}
    </div>

    <div className="divider-dark" style={{ margin: '6px 0' }} />
    <div style={{ padding: '4px 12px 4px', fontSize: 10, fontWeight: 700, color: 'var(--editor-text-dim)', letterSpacing: 1, textTransform: 'uppercase' }}>
      Font Families
    </div>
    <div className="font-list">
      {FONTS.map((font) => (
        <button
          key={font}
          className="font-item"
          style={{ fontFamily: font }}
          onClick={() => onAddText({ fontFamily: font, fontSize: 24, text: font })}
          aria-label={`Add text in ${font}`}
        >
          {font}
        </button>
      ))}
    </div>
  </>
);

// ── Uploads Panel ─────────────────────────────────────────
const UploadsPanel = ({ onUploadImage }) => {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file) return;
    const allowed = ['image/png','image/jpeg','image/jpg','image/gif','image/webp','image/svg+xml'];
    if (!allowed.includes(file.type)) {
      alert(`Unsupported format: ${file.type}. Use PNG, JPG, GIF, WebP, or SVG.`);
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert('File is too large. Maximum supported size is 20 MB.');
      return;
    }
    onUploadImage(file);
  };

  return (
    <div style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Drop zone */}
      <div
        style={{
          border: `2px dashed ${dragOver ? 'var(--prn-lime)' : 'var(--editor-border-strong)'}`,
          borderRadius: 'var(--r-md)', padding: '20px 12px', textAlign: 'center',
          cursor: 'pointer', transition: 'all var(--t-fast)',
          background: dragOver ? 'var(--editor-active)' : 'rgba(255,255,255,0.02)',
        }}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        role="button"
        tabIndex={0}
        aria-label="Upload image - click or drag and drop"
        onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
      >
        <ImgIcon size={22} style={{ color: 'var(--editor-text-muted)', margin: '0 auto 8px' }} />
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--editor-text)', marginBottom: 4 }}>
          {dragOver ? 'Drop to upload' : 'Upload image'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--editor-text-dim)' }}>
          PNG, JPG, GIF, WebP, SVG · Max 20 MB
        </div>
      </div>

      <input
        ref={fileRef} type="file" accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
        style={{ display: 'none' }}
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
      />

      <div style={{ fontSize: 11, color: 'var(--editor-text-dim)', lineHeight: 1.5, textAlign: 'center' }}>
        Uploaded images are stored locally in your browser session. Save your design to keep them.
      </div>
    </div>
  );
};

// ── Templates Panel ───────────────────────────────────────
const TemplatesPanel = ({ onLoadTemplate }) => {
  const [search, setSearch] = useState('');
  const filtered = TEMPLATE_CATALOG.filter((t) =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={{ padding: '8px 10px' }}>
        <input
          className="form-input-dark"
          placeholder="Search templates…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search templates"
        />
      </div>
      <div className="template-grid-inner">
        {filtered.map((t) => (
          <button
            key={t.id}
            className="template-item"
            onClick={() => onLoadTemplate(t)}
            aria-label={`Load template: ${t.name}`}
          >
            <div className="template-item-preview" style={{ background: t.bg }}>
              <span style={{ fontSize: 22 }}>{t.emoji}</span>
            </div>
            <div className="template-item-name">{t.name}</div>
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--editor-text-dim)', fontSize: 12, padding: '20px 10px' }}>
          No templates found
        </div>
      )}
    </>
  );
};

// ── Pages Panel ───────────────────────────────────────────
const PagesPanel = ({ pages, pageIdx, onSelectPage, onAddPage, onDuplicatePage, onDeletePage, onRenamePage }) => {
  const [renamingIdx, setRenamingIdx] = useState(null);
  const [renameVal,   setRenameVal]   = useState('');

  const commitRename = (idx) => {
    if (renameVal.trim()) onRenamePage(idx, renameVal.trim());
    setRenamingIdx(null);
  };

  return (
    <>
      <div className="pages-list">
        {pages.map((page, idx) => (
          <div
            key={page.id}
            className={`page-item ${idx === pageIdx ? 'active' : ''}`}
            onClick={() => onSelectPage(idx)}
            role="button" tabIndex={0}
            aria-label={`Page ${idx + 1}${page.name ? `: ${page.name}` : ''}`}
            aria-pressed={idx === pageIdx}
            onKeyDown={(e) => e.key === 'Enter' && onSelectPage(idx)}
          >
            <div className="page-thumb-box" aria-hidden="true">
              {page.thumbnail
                ? <img src={page.thumbnail} alt="" />
                : <FileText size={16} color="var(--editor-text-dim)" />
              }
            </div>
            <div className="page-item-info">
              {renamingIdx === idx ? (
                <input
                  autoFocus
                  className="form-input-dark"
                  style={{ padding: '3px 6px', fontSize: 11 }}
                  value={renameVal}
                  onChange={(e) => setRenameVal(e.target.value)}
                  onBlur={() => commitRename(idx)}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === 'Enter') commitRename(idx);
                    if (e.key === 'Escape') setRenamingIdx(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Page name"
                />
              ) : (
                <>
                  <div className="page-item-name">{page.name || `Page ${idx + 1}`}</div>
                  <div className="page-item-num">Page {idx + 1} of {pages.length}</div>
                </>
              )}
            </div>
            {/* Page actions */}
            <div style={{ display: 'flex', gap: 1, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
              <button
                className="layer-ctrl-btn" title="Rename page" aria-label="Rename page"
                onClick={() => { setRenameVal(page.name || `Page ${idx + 1}`); setRenamingIdx(idx); }}
              >
                <Pencil size={10} />
              </button>
              <button
                className="layer-ctrl-btn" title="Duplicate page" aria-label="Duplicate page"
                onClick={() => onDuplicatePage(idx)}
              >
                <Copy size={10} />
              </button>
              {pages.length > 1 && (
                <button
                  className="layer-ctrl-btn" title="Delete page" aria-label="Delete page"
                  style={{ color: 'var(--prn-coral)' }}
                  onClick={() => onDeletePage(idx)}
                >
                  <Trash2 size={10} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '8px 10px', borderTop: '1px solid var(--editor-border)' }}>
        <button
          className="btn btn-dark btn-sm"
          style={{ width: '100%', justifyContent: 'center', gap: 6 }}
          onClick={onAddPage}
          aria-label="Add new page"
        >
          <Plus size={13} /> Add page
        </button>
      </div>
    </>
  );
};

// ── Layers Panel ──────────────────────────────────────────
const LayersPanel = ({ objects, selectedObj, onSelectObject, onToggleVisible, onBringForward, onSendBackward, onBringToFront, onSendToBack }) => {
  if (!objects?.length) {
    return (
      <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--editor-text-dim)', fontSize: 12 }}>
        No objects on canvas
      </div>
    );
  }

  const getTypeLabel = (obj) => {
    const map = { 'i-text': 'Text', 'textbox': 'Text', 'image': 'Image',
      rect: 'Rectangle', circle: 'Circle', triangle: 'Triangle',
      line: 'Line', polygon: 'Shape', group: 'Group', ellipse: 'Ellipse',
    };
    return map[obj.type] || 'Object';
  };

  const getTypeIcon = (obj) => {
    if (obj.type === 'i-text' || obj.type === 'textbox') return <Type size={12} />;
    if (obj.type === 'image') return <ImgIcon size={12} />;
    if (obj.type === 'circle' || obj.type === 'ellipse') return <Circle size={12} />;
    if (obj.type === 'triangle') return <Triangle size={12} />;
    if (obj.type === 'line') return <Minus size={12} />;
    if (obj.type === 'group') return <Layers size={12} />;
    return <Square size={12} />;
  };

  const reversed = [...objects].reverse();

  return (
    <>
      <div className="layers-list">
        {reversed.map((obj, idx) => {
          const realIdx = objects.length - 1 - idx;
          const isActive = obj === selectedObj || (selectedObj?.type === 'activeselection' && selectedObj._objects?.includes(obj));
          const isHidden = obj.visible === false;

          return (
            <div
              key={realIdx}
              className={`layer-item ${isActive ? 'active' : ''} ${isHidden ? '' : ''}`}
              onClick={() => onSelectObject(obj)}
              role="button" tabIndex={0}
              aria-label={`Layer: ${getTypeLabel(obj)}`}
              aria-selected={isActive}
              onKeyDown={(e) => e.key === 'Enter' && onSelectObject(obj)}
              style={{ opacity: isHidden ? 0.4 : 1 }}
            >
              <span className="layer-item-icon" style={{ color: isActive ? 'var(--prn-lime)' : 'var(--editor-text-muted)' }}>
                {getTypeIcon(obj)}
              </span>
              <span className="layer-item-name truncate">
                {obj.type === 'i-text' || obj.type === 'textbox'
                  ? (obj.text?.substring(0, 18) || 'Text')
                  : getTypeLabel(obj)
                }
              </span>
              <div style={{ display: 'flex', gap: 1, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                <button
                  className="layer-ctrl-btn"
                  onClick={() => onToggleVisible(obj)}
                  title={isHidden ? 'Show layer' : 'Hide layer'}
                  aria-label={isHidden ? 'Show' : 'Hide'}
                >
                  {isHidden ? <EyeOff size={10} /> : <Eye size={10} />}
                </button>
                <button className="layer-ctrl-btn" onClick={onBringForward}  title="Move up"   aria-label="Move layer up"><ChevronUp size={10} /></button>
                <button className="layer-ctrl-btn" onClick={onSendBackward}  title="Move down" aria-label="Move layer down"><ChevronDown size={10} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Z-order quick actions */}
      <div style={{ padding: '6px 10px', borderTop: '1px solid var(--editor-border)', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <button className="btn btn-dark btn-xs" onClick={onBringToFront} title="Bring to front"><ChevronsUp size={11} /> Front</button>
        <button className="btn btn-dark btn-xs" onClick={onSendToBack}   title="Send to back"><ChevronsDown size={11} /> Back</button>
      </div>
    </>
  );
};

// ── Background Panel ──────────────────────────────────────
const PRESET_BG_COLORS = [
  '#ffffff','#f5f2eb','#0d0e14','#1a1d2e','#0f0f0f',
  '#c8f135','#9b8ef4','#ff5f41','#4fc3f7','#fbbf24',
  '#34d399','#f472b6','#ede9df','#e0f2fe','#fef9c3',
];

const BackgroundPanel = ({ onSetCanvasBg, canvasWidth, canvasHeight }) => {
  const [customColor, setCustomColor] = useState('#ffffff');

  return (
    <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--editor-text-dim)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
          Solid Color
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {PRESET_BG_COLORS.map((c) => (
            <button
              key={c}
              className="color-swatch-item"
              style={{
                background: c,
                border: c === '#ffffff' ? '1.5px solid rgba(255,255,255,0.2)' : '1.5px solid transparent',
              }}
              onClick={() => onSetCanvasBg(c)}
              title={`Background: ${c}`}
              aria-label={`Set background to ${c}`}
            />
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--editor-text-dim)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
          Custom Color
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: 'var(--r-sm)', background: customColor,
              border: '1.5px solid var(--editor-border)', flexShrink: 0, position: 'relative', overflow: 'hidden',
            }}
          >
            <input
              type="color" value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              onBlur={() => onSetCanvasBg(customColor)}
              style={{ position: 'absolute', inset: '-4px', opacity: 0, width: '200%', height: '200%', cursor: 'pointer' }}
              aria-label="Custom background color picker"
            />
          </div>
          <input
            className="form-input-dark"
            value={customColor}
            onChange={(e) => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setCustomColor(e.target.value); }}
            onBlur={() => { if (/^#[0-9a-fA-F]{6}$/.test(customColor)) onSetCanvasBg(customColor); }}
            placeholder="#ffffff"
            aria-label="Background color hex value"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
          />
          <button
            className="btn btn-dark btn-xs"
            onClick={() => onSetCanvasBg(customColor)}
            aria-label="Apply background color"
          >
            Apply
          </button>
        </div>
      </div>

      <div style={{ fontSize: 10, color: 'var(--editor-text-dim)', lineHeight: 1.5 }}>
        Canvas: {canvasWidth}×{canvasHeight}px
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────
const WorkbenchPanel = ({
  canvas, onAddShape, onAddText, onUploadImage, onLoadTemplate,
  pages, pageIdx, onAddPage, onDuplicatePage, onDeletePage, onRenamePage, onSelectPage,
  canvasObjects, selectedObj, onSelectObject, onToggleVisible,
  onBringForward, onSendBackward, onBringToFront, onSendToBack,
  onSetCanvasBg, canvasWidth, canvasHeight,
}) => {
  const ui    = useAppStore((s) => s.ui);
  const setUI = useAppStore((s) => s.setUI);
  const tab   = ui.sidebarTab;

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* ── Dock (icon rail) ─────────────────────────── */}
      <div className="tool-dock" role="navigation" aria-label="Editor tools">
        {TABS.map((t) => {
          const DockIcon = t.Icon;
          return (
            <button
              key={t.id}
              className={`dock-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => setUI({ sidebarTab: t.id })}
              aria-label={t.label}
              aria-pressed={tab === t.id}
            >
              <DockIcon size={18} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Expanded panel ───────────────────────────── */}
      <div className="editor-panel">
        <div className="editor-panel-head">
          <span className="editor-panel-title">{TABS.find((t) => t.id === tab)?.label}</span>
        </div>
        <div className="editor-panel-scroll">
          {tab === 'elements' && (
            <ElementsPanel onAddShape={onAddShape} canvas={canvas} selectedObj={selectedObj} />
          )}
          {tab === 'text' && (
            <TextPanel onAddText={onAddText} />
          )}
          {tab === 'uploads' && (
            <UploadsPanel onUploadImage={onUploadImage} />
          )}
          {tab === 'templates' && (
            <TemplatesPanel onLoadTemplate={onLoadTemplate} />
          )}
          {tab === 'pages' && (
            <PagesPanel
              pages={pages} pageIdx={pageIdx}
              onSelectPage={onSelectPage}
              onAddPage={onAddPage}
              onDuplicatePage={onDuplicatePage}
              onDeletePage={onDeletePage}
              onRenamePage={onRenamePage}
            />
          )}
          {tab === 'layers' && (
            <LayersPanel
              objects={canvasObjects}
              selectedObj={selectedObj}
              onSelectObject={onSelectObject}
              onToggleVisible={onToggleVisible}
              onBringForward={onBringForward}
              onSendBackward={onSendBackward}
              onBringToFront={onBringToFront}
              onSendToBack={onSendToBack}
            />
          )}
          {tab === 'background' && (
            <BackgroundPanel
              onSetCanvasBg={onSetCanvasBg}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkbenchPanel;
