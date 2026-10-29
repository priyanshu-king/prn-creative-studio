/**
 * PRN Inspector — Right Properties Panel
 * Fixes: lock/unlock via canvas.setActiveObject so it's always reachable,
 * full text controls, image flip, opacity slider, corner radius.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Lock, Unlock, FlipHorizontal2, FlipVertical2, Link2, Link2Off,
} from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const round = (v, d = 0) => Math.round(v * Math.pow(10, d)) / Math.pow(10, d);

// ── NumField ──────────────────────────────────────────────
const NumField = ({ label, value, onChange, min = -9999, max = 9999, step = 1, unit = '' }) => {
  const [local, setLocal] = useState(String(round(value, 2)));

  useEffect(() => { setLocal(String(round(value, 2))); }, [value]);

  const commit = () => {
    const n = parseFloat(local);
    if (!isNaN(n)) onChange(clamp(n, min, max));
    else setLocal(String(round(value, 2)));
  };

  return (
    <div className="insp-row">
      {label && <span className="insp-label">{label}</span>}
      <input
        type="number"
        className="insp-input"
        value={local}
        min={min} max={max} step={step}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } }}
        aria-label={label}
      />
      {unit && <span style={{ fontSize: 10, color: 'var(--editor-text-dim)', flexShrink: 0 }}>{unit}</span>}
    </div>
  );
};

// ── ColorField ────────────────────────────────────────────
const ColorField = ({ label, value, onChange, allowTransparent = false }) => {
  // Use prop as source of truth, with local state only for intermediate editing
  const [localHex, setLocalHex] = useState(value || '#000000');
  
  // Update localHex when value changes - using useEffect to avoid ref access during render
  useEffect(() => {
    setLocalHex(value || '#000000');
  }, [value]);

  return (
    <div className="insp-row">
      {label && <span className="insp-label">{label}</span>}
      <div className="insp-color-swatch" style={{ background: value === 'transparent' ? 'transparent' : (value || '#000') }}>
        {value === 'transparent' && (
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-conic-gradient(#aaa 0% 25%, #fff 0% 50%) 0 0 / 6px 6px' }} />
        )}
        <input
          type="color"
          value={localHex.startsWith('#') && localHex.length === 7 ? localHex : '#000000'}
          onChange={(e) => { setLocalHex(e.target.value); onChange(e.target.value); }}
          aria-label={`${label} color picker`}
        />
      </div>
      <input
        type="text" className="insp-input" value={localHex}
        onChange={(e) => {
          setLocalHex(e.target.value);
          if (allowTransparent && e.target.value.toLowerCase() === 'transparent') onChange('transparent');
          else if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) onChange(e.target.value);
        }}
        onBlur={() => { if (!/^#[0-9a-fA-F]{6}$/.test(localHex) && localHex !== 'transparent') setLocalHex(value || '#000000'); }}
        placeholder="#000000"
        aria-label={`${label} hex value`}
        style={{ fontFamily: 'var(--font-mono)', fontSize: 11, maxWidth: 78 }}
      />
    </div>
  );
};

const FONT_FAMILIES = [
  'Inter', 'Georgia', 'Arial', 'Verdana', 'Helvetica',
  'Times New Roman', 'Trebuchet MS', 'Courier New', 'Impact', 'Palatino',
];

// ═══════════════════════════════════════════════════════════
const Inspector = ({ canvas, selectedObj, onSetCanvasBg, canvasWidth, canvasHeight }) => {
  // Apply change to canvas object
  const apply = useCallback((changes) => {
    if (!canvas || !selectedObj) return;
    const obj = selectedObj;

    for (const [key, val] of Object.entries(changes)) {
      if (key === 'w') obj.set('scaleX', val / (obj.width  || 1));
      else if (key === 'h') obj.set('scaleY', val / (obj.height || 1));
      else if (key === 'opacity') obj.set('opacity', clamp(val, 0, 100) / 100);
      else if (key === 'x') obj.set('left', val);
      else if (key === 'y') obj.set('top',  val);
      else if (key === 'rot') obj.set('angle', val);
      else if (key === 'lock') {
        const locked = Boolean(val);
        obj.set({
          lockMovementX: locked, lockMovementY: locked,
          lockScalingX:  locked, lockScalingY:  locked,
          lockRotation:  locked,
          hasControls:   !locked,
          hasBorders:    !locked,
          evented: true,
          selectable: true,  // keep selectable so user can unlock it
        });
      } else {
        obj.set(key, val);
      }
    }

    obj.setCoords();
    canvas.renderAll();
    canvas.fire('object:modified', { target: obj });
  }, [canvas, selectedObj]);

  if (!selectedObj) {
    return (
      <aside className="editor-inspector" aria-label="Properties panel">
        <div className="inspector-head">Properties</div>
        <div className="inspector-body">
          {/* Canvas info */}
          <div className="insp-section">
            <div className="insp-section-title">Canvas</div>
            <div style={{ fontSize: 11, color: 'var(--editor-text-muted)' }}>
              {canvasWidth} × {canvasHeight} px
            </div>
            <div style={{ marginTop: 6 }}>
              <div style={{ fontSize: 10, color: 'var(--editor-text-dim)', marginBottom: 4 }}>Background</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <div
                  style={{
                    width: 24, height: 24, borderRadius: 4, background: canvas?.backgroundColor || '#fff',
                    border: '1px solid var(--editor-border)', cursor: 'pointer', position: 'relative', overflow: 'hidden',
                  }}
                >
                  <input
                    type="color"
                    value={canvas?.backgroundColor || '#ffffff'}
                    onChange={(e) => onSetCanvasBg(e.target.value)}
                    style={{ position: 'absolute', inset: '-4px', opacity: 0, width: '200%', height: '200%', cursor: 'pointer' }}
                    aria-label="Canvas background color"
                  />
                </div>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--editor-text-muted)' }}>
                  {canvas?.backgroundColor || '#ffffff'}
                </span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 11, color: 'var(--editor-text-dim)', textAlign: 'center', padding: '16px 0' }}>
            Select an object to edit its properties
          </p>
        </div>
      </aside>
    );
  }

  const obj = selectedObj;
  const isText  = obj.type === 'i-text' || obj.type === 'textbox';
  const isImage = obj.type === 'image';
  const isLine  = obj.type === 'line';
  const isGroup = obj.type === 'group';

  const x     = round(obj.left  || 0);
  const y     = round(obj.top   || 0);
  const w     = round((obj.width  || 0) * (obj.scaleX || 1));
  const h     = round((obj.height || 0) * (obj.scaleY || 1));
  const rot   = round(obj.angle || 0);
  const opct  = round((obj.opacity !== undefined ? obj.opacity : 1) * 100);
  const fill  = typeof obj.fill === 'string' ? obj.fill : '#000000';
  const stroke = obj.stroke || '';
  const strokeW = obj.strokeWidth || 0;
  const locked = !!(obj.lockMovementX && obj.lockMovementY);

  return (
    <aside className="editor-inspector" aria-label="Properties panel">
      <div className="inspector-head">Properties</div>
      <div className="inspector-body">

        {/* Position & Size */}
        <div className="insp-section">
          <div className="insp-section-title">Transform</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            <NumField label="X" value={x} onChange={(v) => apply({ x: v })} />
            <NumField label="Y" value={y} onChange={(v) => apply({ y: v })} />
            <NumField label="W" value={w} min={1} onChange={(v) => apply({ w: v })} />
            <NumField label="H" value={h} min={1} onChange={(v) => apply({ h: v })} />
          </div>
          <NumField label="°" value={rot} min={-360} max={360} unit="rot" onChange={(v) => apply({ rot: v })} />
          <div className="insp-row" style={{ marginTop: 2 }}>
            <span className="insp-label" style={{ width: 16 }}>%</span>
            <input
              type="range" min={0} max={100} value={opct}
              onChange={(e) => apply({ opacity: parseInt(e.target.value) })}
              style={{ flex: 1, accentColor: 'var(--prn-lime)' }}
              aria-label="Opacity"
            />
            <span style={{ fontSize: 11, color: 'var(--editor-text-muted)', minWidth: 30, textAlign: 'right' }}>
              {opct}%
            </span>
          </div>
        </div>

        {/* Fill */}
        {!isLine && (
          <div className="insp-section">
            <div className="insp-section-title">Fill</div>
            <ColorField label="Fill" value={fill} onChange={(v) => apply({ fill: v })} allowTransparent />
          </div>
        )}

        {/* Stroke */}
        <div className="insp-section">
          <div className="insp-section-title">Stroke</div>
          <ColorField label={isLine ? 'Color' : 'Color'} value={stroke || '#000000'} onChange={(v) => apply({ stroke: v })} />
          <NumField label="W" value={strokeW} min={0} max={100} unit="px" onChange={(v) => apply({ strokeWidth: v })} />
        </div>

        {/* Text */}
        {isText && (
          <div className="insp-section">
            <div className="insp-section-title">Text</div>

            <div className="insp-row">
              <span className="insp-label insp-label-wide">Font</span>
              <select
                className="insp-input"
                value={obj.fontFamily || 'Inter'}
                onChange={(e) => apply({ fontFamily: e.target.value })}
                aria-label="Font family"
                style={{ appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              <NumField label="Sz" value={obj.fontSize || 24} min={4} max={800} unit="px" onChange={(v) => apply({ fontSize: v })} />
              <NumField label="LH" value={round(obj.lineHeight || 1.16, 2)} min={0.5} max={5} step={0.1} onChange={(v) => apply({ lineHeight: v })} />
            </div>

            <div className="insp-row">
              <span className="insp-label insp-label-wide">Weight</span>
              <select
                className="insp-input"
                value={obj.fontWeight || '400'}
                onChange={(e) => apply({ fontWeight: e.target.value })}
                aria-label="Font weight"
                style={{ appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}
              >
                {['100','200','300','400','500','600','700','800','900'].map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            {/* Style toggles */}
            <div className="insp-row" style={{ flexWrap: 'wrap', gap: 4 }}>
              <span className="insp-label insp-label-wide">Style</span>
              <div style={{ display: 'flex', gap: 3 }}>
                {[
                  { k: 'fontStyle',      v: 'italic',    label: 'I',  style: { fontStyle: 'italic', fontWeight: 700 } },
                  { k: 'textDecoration', v: 'underline', label: 'U',  style: { textDecoration: 'underline', fontWeight: 700 } },
                  { k: 'textDecoration', v: 'line-through', label: 'S', style: { textDecoration: 'line-through', fontWeight: 700 } },
                ].map(({ k, v, label, style: btnStyle }) => {
                  const isActive = k === 'fontStyle' ? obj.fontStyle === v : obj.textDecoration === v;
                  return (
                    <button
                      key={label}
                      className={`btn-icon-dark btn ${isActive ? 'active' : ''}`}
                      style={{ ...btnStyle, width: 24, height: 24, fontSize: 13, padding: 0 }}
                      onClick={() => apply({ [k]: isActive ? (k === 'fontStyle' ? 'normal' : '') : v })}
                      aria-label={label} aria-pressed={isActive}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Text align */}
            <div className="insp-row">
              <span className="insp-label insp-label-wide">Align</span>
              <div className="toggle-group">
                {['left','center','right'].map((a) => (
                  <button
                    key={a} className={`toggle-btn ${obj.textAlign === a ? 'active' : ''}`}
                    onClick={() => apply({ textAlign: a })}
                    aria-label={`Align ${a}`} aria-pressed={obj.textAlign === a}
                  >
                    {a === 'left' ? '⌶' : a === 'center' ? '⊟' : '⌷'}
                  </button>
                ))}
              </div>
            </div>

            {/* Text color */}
            <ColorField label="Color" value={fill} onChange={(v) => apply({ fill: v })} />

            {/* Char spacing */}
            <NumField label="Sp" value={round(obj.charSpacing || 0)} min={-200} max={2000} unit="em/1000" onChange={(v) => apply({ charSpacing: v })} />
          </div>
        )}

        {/* Image */}
        {isImage && (
          <div className="insp-section">
            <div className="insp-section-title">Image</div>
            <div className="insp-row">
              <span className="insp-label insp-label-wide">Flip</span>
              <button
                className="btn btn-dark btn-xs"
                onClick={() => { obj.set('flipX', !obj.flipX); canvas.renderAll(); canvas.fire('object:modified', { target: obj }); }}
                aria-label="Flip horizontal"
              >
                <FlipHorizontal2 size={11} /> H
              </button>
              <button
                className="btn btn-dark btn-xs"
                onClick={() => { obj.set('flipY', !obj.flipY); canvas.renderAll(); canvas.fire('object:modified', { target: obj }); }}
                aria-label="Flip vertical"
                style={{ marginLeft: 4 }}
              >
                <FlipVertical2 size={11} /> V
              </button>
            </div>
          </div>
        )}

        {/* Rect corner radius */}
        {obj.type === 'rect' && (
          <div className="insp-section">
            <div className="insp-section-title">Corners</div>
            <NumField label="R" value={round(obj.rx || 0)} min={0} max={500} unit="px" onChange={(v) => apply({ rx: v, ry: v })} />
          </div>
        )}

        {/* Lock */}
        <div className="insp-section">
          <div className="insp-section-title">Object</div>
          <div className="insp-row">
            <span className="insp-label insp-label-wide">Lock</span>
            <button
              className={`btn ${locked ? 'btn-primary' : 'btn-dark'} btn-xs`}
              onClick={() => apply({ lock: !locked })}
              title={locked ? 'Unlock object' : 'Lock position and size'}
              aria-label={locked ? 'Unlock object' : 'Lock object'}
              aria-pressed={locked}
            >
              {locked ? <Lock size={11} /> : <Unlock size={11} />}
              {locked ? 'Locked' : 'Lock'}
            </button>
          </div>
          {locked && (
            <div style={{ fontSize: 10, color: 'var(--prn-lime)', marginTop: 2, opacity: 0.7 }}>
              Object is locked. Movement and scaling are disabled.
            </div>
          )}
        </div>

        {/* Group info */}
        {isGroup && (
          <div className="insp-section">
            <div className="insp-section-title">Group</div>
            <div style={{ fontSize: 11, color: 'var(--editor-text-muted)' }}>
              {obj._objects?.length || 0} objects grouped
            </div>
            <div style={{ fontSize: 10, color: 'var(--editor-text-dim)', marginTop: 2 }}>
              Ctrl+Shift+G to ungroup
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Inspector;
