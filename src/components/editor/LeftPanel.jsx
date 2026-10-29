/**
 * PRN Editor — Left Panel
 * Tab-based: Elements, Text, Images, Templates, Pages, Layers
 */
import React, { useRef, useState } from 'react';
import {
  Shapes, Type, Image as ImageIcon, Layout,
  Layers, FileText, ChevronDown, ChevronRight,
  Square, Circle, Triangle, Minus, Star, Pentagon,
  ArrowRight, Hexagon,
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';

// ── Tab defs ──────────────────────────────────────────────
const TABS = [
  { id: 'elements',  label: 'Elements', Icon: Shapes   },
  { id: 'text',      label: 'Text',     Icon: Type     },
  { id: 'uploads',   label: 'Uploads',  Icon: ImageIcon},
  { id: 'templates', label: 'Templates',Icon: Layout   },
  { id: 'pages',     label: 'Pages',    Icon: FileText },
  { id: 'layers',    label: 'Layers',   Icon: Layers   },
];

// ── Shapes catalog ────────────────────────────────────────
const SHAPES = [
  { id: 'rect',     label: 'Rectangle', Icon: Square   },
  { id: 'circle',   label: 'Circle',    Icon: Circle   },
  { id: 'triangle', label: 'Triangle',  Icon: Triangle },
  { id: 'line',     label: 'Line',      Icon: Minus    },
  { id: 'star',     label: 'Star',      Icon: Star     },
  { id: 'arrow',    label: 'Arrow',     Icon: ArrowRight},
];

// ── Font families ─────────────────────────────────────────
const FONTS = [
  'Inter', 'Georgia', 'Arial', 'Verdana', 'Trebuchet MS',
  'Times New Roman', 'Courier New', 'Impact', 'Comic Sans MS',
  'Palatino', 'Garamond', 'Bookman', 'Tahoma', 'Helvetica',
];

// ── Mini template catalog ─────────────────────────────────
const TEMPLATES_DATA = [
  { id: 't1', name: 'Bold Social Post',    category: 'Social',       emoji: '📸', bg: '#6366f1', w: 1080, h: 1080 },
  { id: 't2', name: 'Clean Presentation', category: 'Presentation', emoji: '📊', bg: '#0ea5e9', w: 1920, h: 1080 },
  { id: 't3', name: 'Story Template',     category: 'Social',       emoji: '✨', bg: '#ec4899', w: 1080, h: 1920 },
  { id: 't4', name: 'YouTube Thumbnail',  category: 'YouTube',      emoji: '▶️', bg: '#ef4444', w: 1280, h: 720  },
  { id: 't5', name: 'Resume Basic',       category: 'Document',     emoji: '📄', bg: '#1f2937', w: 794,  h: 1123 },
  { id: 't6', name: 'Event Flyer',        category: 'Print',        emoji: '🎉', bg: '#f59e0b', w: 1587, h: 2245 },
  { id: 't7', name: 'Business Card',      category: 'Print',        emoji: '💼', bg: '#10b981', w: 1050, h: 600  },
  { id: 't8', name: 'Logo Starter',       category: 'Branding',     emoji: '🎨', bg: '#8b5cf6', w: 800,  h: 800  },
];

// ── Sub-panels ────────────────────────────────────────────

const ElementsPanel = ({ onAddShape }) => (
  <div className="editor-panel-body">
    <div className="prop-group-title" style={{ marginBottom: 10 }}>Shapes</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {SHAPES.map((shape) => {
        const ShapeIcon = shape.Icon;
        return (
          <button
            key={shape.id}
            className="shape-btn"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '14px 8px', border: '1px solid var(--gray-200)', borderRadius: 10, background: '#fafafa', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: 'var(--gray-600)', transition: 'all 0.15s' }}
            onClick={() => onAddShape(shape.id)}
            aria-label={`Add ${shape.label}`}
          >
            <ShapeIcon size={20} />
            <span>{shape.label}</span>
          </button>
        );
      })}
    </div>

    <div className="prop-group-title" style={{ marginTop: 20, marginBottom: 10 }}>Colors</div>
    <div className="color-grid">
      {['#5b50d6','#e84393','#f59e0b','#10b981','#0ea5e9','#ef4444','#8b5cf6','#6366f1','#ec4899','#14b8a6','#111827','#ffffff'].map((c) => (
        <div
          key={c}
          className="color-dot"
          style={{ background: c, border: c === '#ffffff' ? '2px solid #e5e7eb' : '2px solid transparent' }}
          title={c}
          role="presentation"
        />
      ))}
    </div>
  </div>
);

const TextPanel = ({ onAddText }) => {
  const textOptions = [
    { label: 'Add Heading',    size: 48, weight: 800,  style: { fontSize: 14, fontWeight: 800 } },
    { label: 'Add Subheading', size: 32, weight: 600,  style: { fontSize: 13, fontWeight: 600 } },
    { label: 'Add Body Text',  size: 18, weight: 400,  style: { fontSize: 12 } },
    { label: 'Add Caption',    size: 13, weight: 400,  style: { fontSize: 11, color: 'var(--gray-500)' } },
  ];

  return (
    <div className="editor-panel-body">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {textOptions.map(({ label, size, weight, style }) => (
          <button
            key={label}
            onClick={() => onAddText({ fontSize: size, fontWeight: weight })}
            style={{
              ...style,
              padding: '12px 14px',
              border: '1px solid var(--gray-200)',
              borderRadius: 8,
              background: '#fafafa',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'var(--gray-800)',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#eeedf8'; e.currentTarget.style.borderColor = '#c4c0f0'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.borderColor = 'var(--gray-200)'; }}
            aria-label={label}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="prop-group-title" style={{ marginTop: 20, marginBottom: 10 }}>Font families</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {FONTS.map((font) => (
          <button
            key={font}
            onClick={() => onAddText({ fontFamily: font, fontSize: 24 })}
            style={{
              padding: '8px 12px', fontFamily: font, fontSize: 14,
              border: '1px solid var(--gray-200)', borderRadius: 6,
              background: 'transparent', cursor: 'pointer', textAlign: 'left',
              color: 'var(--gray-700)', transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f4fd'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            {font}
          </button>
        ))}
      </div>
    </div>
  );
};

const UploadsPanel = ({ onUploadImage }) => {
  const fileRef = useRef(null);

  return (
    <div className="editor-panel-body">
      <button
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}
        onClick={() => fileRef.current?.click()}
        aria-label="Upload image from computer"
      >
        <ImageIcon size={15} />
        Upload from computer
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) { onUploadImage(file); e.target.value = ''; }
        }}
        aria-label="File input for image upload"
      />
      <p style={{ fontSize: 12, color: 'var(--gray-400)', lineHeight: 1.5, textAlign: 'center' }}>
        Supports PNG, JPG, GIF, WebP, SVG.<br />
        Max recommended: 10 MB.
      </p>
    </div>
  );
};

const TemplatesPanel = ({ onLoadTemplate }) => {
  const [search, setSearch] = useState('');
  const filtered = TEMPLATES_DATA.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="editor-panel-body" style={{ padding: 12 }}>
      <input
        className="form-input"
        style={{ marginBottom: 12, fontSize: 13 }}
        placeholder="Search templates…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search templates"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {filtered.map((t) => (
          <button
            key={t.id}
            className="template-card"
            onClick={() => onLoadTemplate(t)}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
            aria-label={`Load template: ${t.name}`}
          >
            <div
              className="template-card-preview"
              style={{ background: t.bg, aspectRatio: t.w / t.h > 1.5 ? '16/9' : t.w === t.h ? '1/1' : '9/16' }}
            >
              <span style={{ fontSize: 28 }}>{t.emoji}</span>
            </div>
            <div className="template-card-info">
              <div className="template-card-name">{t.name}</div>
              <div className="template-card-cat">{t.category} · {t.w}×{t.h}</div>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--gray-400)', fontSize: 13, padding: '24px 0' }}>
          No templates found.
        </p>
      )}
    </div>
  );
};

const PagesPanel = ({ pages, currentPageIndex, onAddPage, onSelectPage, onDuplicatePage }) => (
  <div className="editor-panel-body" style={{ padding: '8px 0' }}>
    <div className="pages-strip">
      {pages.map((page, idx) => (
        <div
          key={page.id}
          className={`page-thumb ${idx === currentPageIndex ? 'active' : ''}`}
          onClick={() => onSelectPage(idx)}
          role="button"
          tabIndex={0}
          aria-label={`Page ${idx + 1}${page.name ? `: ${page.name}` : ''}`}
          aria-pressed={idx === currentPageIndex}
          onKeyDown={(e) => e.key === 'Enter' && onSelectPage(idx)}
        >
          <div className="page-thumb-canvas" aria-hidden="true">
            {page.thumbnail
              ? <img src={page.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <FileText size={20} color="var(--gray-300)" />
            }
          </div>
          <div className="page-thumb-info">
            <div className="page-thumb-name">{page.name || `Page ${idx + 1}`}</div>
            <div className="page-thumb-num">Page {idx + 1} of {pages.length}</div>
          </div>
        </div>
      ))}
    </div>

    <div style={{ display: 'flex', gap: 8, padding: '8px 12px', borderTop: '1px solid var(--gray-100)', marginTop: 4 }}>
      <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={onAddPage}>
        + Add page
      </button>
      {pages.length > 1 && (
        <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => onDuplicatePage(currentPageIndex)}>
          Duplicate
        </button>
      )}
    </div>
  </div>
);

const LayersPanel = ({ objects, activeId, onSelect, onToggleVisible }) => {
  if (!objects || objects.length === 0) {
    return (
      <div className="editor-panel-body" style={{ textAlign: 'center', color: 'var(--gray-400)', fontSize: 13, padding: '32px 12px' }}>
        No objects on canvas yet.
      </div>
    );
  }

  const reversed = [...objects].reverse();

  return (
    <div className="editor-panel-body" style={{ padding: 8 }}>
      <div className="layers-list">
        {reversed.map((obj, idx) => {
          const realIdx = objects.length - 1 - idx;
          const isActive = obj === activeId || (activeId && activeId._id === obj._id);
          const typeLabel = obj.type === 'i-text' ? 'Text'
            : obj.type === 'image' ? 'Image'
            : obj.type === 'rect' ? 'Rectangle'
            : obj.type === 'circle' ? 'Circle'
            : obj.type === 'triangle' ? 'Triangle'
            : obj.type === 'line' ? 'Line'
            : obj.type === 'path' ? 'Path'
            : obj.type || 'Object';

          return (
            <div
              key={realIdx}
              className={`layer-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelect(obj)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(obj)}
              aria-label={`Layer: ${typeLabel}`}
              aria-selected={isActive}
            >
              <span style={{ fontSize: 11, color: 'var(--gray-400)', width: 18, textAlign: 'right', flexShrink: 0 }}>
                {realIdx + 1}
              </span>
              <span className="layer-item-name">{typeLabel}</span>
              <button
                className="layer-icon-btn"
                onClick={(e) => { e.stopPropagation(); onToggleVisible(obj); }}
                title={obj.visible === false ? 'Show' : 'Hide'}
                aria-label={obj.visible === false ? 'Show layer' : 'Hide layer'}
              >
                {obj.visible === false ? '👁‍🗨' : '👁'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Main LeftPanel component ──────────────────────────────
const LeftPanel = ({
  onAddShape, onAddText, onUploadImage,
  onLoadTemplate,
  pages, currentPageIndex,
  onAddPage, onSelectPage, onDuplicatePage,
  canvasObjects, activeObject,
  onSelectObject, onToggleVisible,
}) => {
  const ui    = useAppStore((s) => s.ui);
  const setUI = useAppStore((s) => s.setUI);
  const tab   = ui.sidebarTab;

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Icon rail */}
      <div className="editor-left" role="navigation" aria-label="Editor tools">
        {TABS.map((tabItem) => {
          const TabIcon = tabItem.Icon;
          return (
            <button
              key={tabItem.id}
              className={`editor-left-btn ${tab === tabItem.id ? 'active' : ''}`}
              onClick={() => setUI({ sidebarTab: tabItem.id })}
              aria-label={tabItem.label}
              aria-pressed={tab === tabItem.id}
            >
              <TabIcon size={20} />
              <span>{tabItem.label}</span>
            </button>
          );
        })}
      </div>

      {/* Expanded panel */}
      <div className="editor-panel">
        <div className="editor-panel-header">
          <div className="editor-panel-title">{TABS.find((t) => t.id === tab)?.label}</div>
        </div>

        {tab === 'elements' && (
          <ElementsPanel onAddShape={onAddShape} />
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
            pages={pages}
            currentPageIndex={currentPageIndex}
            onAddPage={onAddPage}
            onSelectPage={onSelectPage}
            onDuplicatePage={onDuplicatePage}
          />
        )}
        {tab === 'layers' && (
          <LayersPanel
            objects={canvasObjects}
            activeId={activeObject}
            onSelect={onSelectObject}
            onToggleVisible={onToggleVisible}
          />
        )}
      </div>
    </div>
  );
};

export default LeftPanel;
