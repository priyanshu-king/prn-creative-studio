/**
 * PRN Editor — Right Properties Panel
 * Shows contextual controls based on the selected object type.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, FlipHorizontal2, FlipVertical2, Lock, Unlock } from 'lucide-react';

// Numeric prop input
const NumInput = ({ label, value, onChange, min, max, unit = '' }) => (
  <div className="prop-row">
    <span className="prop-label">{label}</span>
    <input
      type="number"
      className="prop-input"
      value={Math.round(value * 100) / 100}
      min={min}
      max={max}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      aria-label={label}
      style={{ maxWidth: 76 }}
    />
    {unit && <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{unit}</span>}
  </div>
);

const ColorInput = ({ label, value, onChange }) => (
  <div className="prop-row">
    <span className="prop-label">{label}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div
        style={{
          width: 26, height: 26, borderRadius: 6,
          background: value || '#000',
          border: '2px solid var(--gray-200)',
          cursor: 'pointer', position: 'relative', overflow: 'hidden',
        }}
      >
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          style={{ position: 'absolute', inset: '-4px', opacity: 0, width: '200%', height: '200%', cursor: 'pointer' }}
          aria-label={`${label} color picker`}
        />
      </div>
      <input
        type="text"
        className="prop-input"
        value={value || ''}
        onChange={(e) => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) onChange(e.target.value); }}
        placeholder="#000000"
        style={{ fontSize: 12, fontFamily: 'monospace', maxWidth: 80 }}
        aria-label={`${label} hex value`}
      />
    </div>
  </div>
);

const FONT_FAMILIES = [
  'Inter', 'Georgia', 'Arial', 'Verdana', 'Trebuchet MS',
  'Times New Roman', 'Courier New', 'Impact', 'Helvetica',
  'Palatino', 'Garamond', 'Tahoma',
];

const PropertiesPanel = ({ canvas, selectedObject }) => {
  const [props, setProps] = useState({});
  const [, forceUpdate] = useState(0);

  const readProps = useCallback(() => {
    if (!selectedObject) { setProps({}); return; }
    const obj = selectedObject;
    setProps({
      x:          Math.round(obj.left || 0),
      y:          Math.round(obj.top  || 0),
      width:      Math.round((obj.width  || 0) * (obj.scaleX || 1)),
      height:     Math.round((obj.height || 0) * (obj.scaleY || 1)),
      rotation:   Math.round(obj.angle || 0),
      opacity:    Math.round((obj.opacity !== undefined ? obj.opacity : 1) * 100),
      fill:       (typeof obj.fill === 'string' ? obj.fill : '') || '',
      stroke:     obj.stroke || '',
      strokeWidth:obj.strokeWidth || 1,
      locked:     obj.lockMovementX && obj.lockMovementY,
      // Text
      fontSize:       obj.fontSize   || 24,
      fontFamily:     obj.fontFamily || 'Inter',
      fontWeight:     obj.fontWeight || '400',
      fontStyle:      obj.fontStyle  || 'normal',
      textDecoration: obj.textDecoration || '',
      textAlign:      obj.textAlign  || 'left',
      lineHeight:     obj.lineHeight || 1.16,
    });
  }, [selectedObject]);

  useEffect(() => { readProps(); }, [selectedObject, readProps]); // eslint-disable-line react-hooks/set-state-in-effect

  // Apply a change back to the canvas object
  const apply = useCallback((changes) => {
    if (!canvas || !selectedObject) return;
    const obj = selectedObject;

    Object.entries(changes).forEach(([key, val]) => {
      if (key === 'width') {
        obj.set('scaleX', val / (obj.width || 1));
      } else if (key === 'height') {
        obj.set('scaleY', val / (obj.height || 1));
      } else if (key === 'opacity') {
        obj.set('opacity', val / 100);
      } else if (key === 'x') {
        obj.set('left', val);
      } else if (key === 'y') {
        obj.set('top', val);
      } else if (key === 'rotation') {
        obj.set('angle', val);
      } else if (key === 'locked') {
        obj.set({
          lockMovementX: val, lockMovementY: val,
          lockScalingX:  val, lockScalingY:  val,
          lockRotation:  val,
          selectable: !val,
          evented: true,
        });
      } else {
        obj.set(key, val);
      }
    });

    obj.setCoords();
    canvas.renderAll();
    canvas.fire('object:modified', { target: obj });
    setProps((prev) => ({ ...prev, ...changes }));
    forceUpdate((n) => n + 1);
  }, [canvas, selectedObject]);

  const isText  = selectedObject?.type === 'i-text' || selectedObject?.type === 'textbox';
  const isImage = selectedObject?.type === 'image';
  const isLine  = selectedObject?.type === 'line';

  if (!selectedObject) {
    return (
      <div className="editor-right">
        <div className="editor-right-header">Properties</div>
        <div className="editor-right-body">
          <p style={{ fontSize: 13, color: 'var(--gray-400)', lineHeight: 1.5, textAlign: 'center', padding: '16px 0' }}>
            Select an object to see its properties.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-right" role="complementary" aria-label="Properties panel">
      <div className="editor-right-header">Properties</div>
      <div className="editor-right-body">

        {/* Position */}
        <div className="prop-group">
          <div className="prop-group-title">Position</div>
          <NumInput label="X"    value={props.x || 0}    onChange={(v) => apply({ x: v })} />
          <NumInput label="Y"    value={props.y || 0}    onChange={(v) => apply({ y: v })} />
          <NumInput label="W"    value={props.width || 0} min={1} onChange={(v) => apply({ width: v })} />
          <NumInput label="H"    value={props.height || 0} min={1} onChange={(v) => apply({ height: v })} />
          <NumInput label="Rot"  value={props.rotation || 0} min={-360} max={360} unit="°" onChange={(v) => apply({ rotation: v })} />
          <NumInput label="Opacity" value={props.opacity ?? 100} min={0} max={100} unit="%" onChange={(v) => apply({ opacity: v })} />
        </div>

        {/* Fill + Stroke */}
        {!isLine && (
          <div className="prop-group">
            <div className="prop-group-title">Fill</div>
            <ColorInput label="Fill" value={props.fill} onChange={(v) => apply({ fill: v })} />
          </div>
        )}

        <div className="prop-group">
          <div className="prop-group-title">Stroke</div>
          <ColorInput label="Color" value={props.stroke} onChange={(v) => apply({ stroke: v })} />
          <NumInput label="Width" value={props.strokeWidth || 0} min={0} max={50} onChange={(v) => apply({ strokeWidth: v })} />
        </div>

        {/* Text controls */}
        {isText && (
          <div className="prop-group">
            <div className="prop-group-title">Text</div>

            <div className="prop-row">
              <span className="prop-label">Font</span>
              <select
                className="font-select"
                value={props.fontFamily}
                onChange={(e) => apply({ fontFamily: e.target.value })}
                aria-label="Font family"
                style={{ flex: 1 }}
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                ))}
              </select>
            </div>

            <NumInput label="Size" value={props.fontSize || 24} min={6} max={500} unit="px" onChange={(v) => apply({ fontSize: v })} />

            <div className="prop-row">
              <span className="prop-label">Weight</span>
              <select
                className="font-select"
                value={props.fontWeight}
                onChange={(e) => apply({ fontWeight: e.target.value })}
                aria-label="Font weight"
                style={{ flex: 1, maxWidth: 130 }}
              >
                {['100','200','300','400','500','600','700','800','900','bold','normal'].map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            <div className="prop-row">
              <span className="prop-label">Align</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {['left','center','right','justify'].map((a) => (
                  <button
                    key={a}
                    className={`btn btn-icon btn-sm ${props.textAlign === a ? 'active' : ''}`}
                    style={{ width: 28, height: 28, fontSize: 12, padding: 0 }}
                    onClick={() => apply({ textAlign: a })}
                    title={`Align ${a}`}
                    aria-label={`Text align ${a}`}
                    aria-pressed={props.textAlign === a}
                  >
                    {a === 'left' ? '⬅' : a === 'center' ? '↔' : a === 'right' ? '➡' : '≡'}
                  </button>
                ))}
              </div>
            </div>

            <div className="prop-row">
              <span className="prop-label">Style</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  className={`btn btn-icon btn-sm ${props.fontStyle === 'italic' ? 'active' : ''}`}
                  style={{ width: 28, height: 28, fontStyle: 'italic', fontWeight: 700, fontSize: 14 }}
                  onClick={() => apply({ fontStyle: props.fontStyle === 'italic' ? 'normal' : 'italic' })}
                  aria-label="Italic"
                  aria-pressed={props.fontStyle === 'italic'}
                  title="Italic"
                >I</button>
                <button
                  className={`btn btn-icon btn-sm ${props.textDecoration === 'underline' ? 'active' : ''}`}
                  style={{ width: 28, height: 28, textDecoration: 'underline', fontWeight: 700, fontSize: 14 }}
                  onClick={() => apply({ textDecoration: props.textDecoration === 'underline' ? '' : 'underline' })}
                  aria-label="Underline"
                  aria-pressed={props.textDecoration === 'underline'}
                  title="Underline"
                >U</button>
              </div>
            </div>

            <NumInput label="Line H" value={props.lineHeight || 1.16} min={0.5} max={5} onChange={(v) => apply({ lineHeight: v })} />
            <ColorInput label="Color" value={props.fill} onChange={(v) => apply({ fill: v })} />
          </div>
        )}

        {/* Lock */}
        <div className="prop-group">
          <div className="prop-group-title">Object</div>
          <div className="prop-row">
            <span className="prop-label">Lock</span>
            <button
              className={`btn btn-icon btn-sm ${props.locked ? 'active' : ''}`}
              onClick={() => apply({ locked: !props.locked })}
              title={props.locked ? 'Unlock object' : 'Lock object'}
              aria-label={props.locked ? 'Unlock object' : 'Lock object'}
              aria-pressed={!!props.locked}
            >
              {props.locked ? <Lock size={14} /> : <Unlock size={14} />}
            </button>
          </div>
        </div>

        {/* Image flips */}
        {isImage && (
          <div className="prop-group">
            <div className="prop-group-title">Image</div>
            <div className="prop-row">
              <span className="prop-label">Flip</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  className="btn btn-icon btn-sm"
                  onClick={() => { selectedObject.set('flipX', !selectedObject.flipX); canvas.renderAll(); canvas.fire('object:modified', { target: selectedObject }); }}
                  title="Flip horizontal"
                  aria-label="Flip horizontal"
                >
                  <FlipHorizontal2 size={14} />
                </button>
                <button
                  className="btn btn-icon btn-sm"
                  onClick={() => { selectedObject.set('flipY', !selectedObject.flipY); canvas.renderAll(); canvas.fire('object:modified', { target: selectedObject }); }}
                  title="Flip vertical"
                  aria-label="Flip vertical"
                >
                  <FlipVertical2 size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;
