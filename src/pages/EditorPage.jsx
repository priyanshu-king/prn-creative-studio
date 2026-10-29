/**
 * PRN Editor Page — Creative Workbench
 * Fixes: double-history save, template query param, page deletion,
 * lock/unlock UX, multi-page PDF, mobile, z-order, grouping.
 */
import React, {
  useEffect, useRef, useState, useCallback,
} from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import * as fabric from 'fabric';
import { jsPDF } from 'jspdf';

import useAppStore, { createBlankPage } from '../store/useAppStore';
import useCanvasHistory from '../hooks/useCanvasHistory';
import EditorTopbar from '../components/editor/EditorTopbar';
import WorkbenchPanel from '../components/editor/WorkbenchPanel';
import Inspector from '../components/editor/Inspector';

// ── Template catalog (canonical source, used by both panel and public page) ──
import { TEMPLATE_CATALOG } from '../constants/templates';

// ── Export helpers ───────────────────────────────────────────
const slugify = (s) => s.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '');

const download = (data, filename, type = 'text/plain') => {
  const a = document.createElement('a');
  if (data.startsWith('data:') || data.startsWith('blob:')) {
    a.href = data;
  } else {
    const blob = new Blob([data], { type });
    a.href = URL.createObjectURL(blob);
  }
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const exportCanvas = async (canvas, format, allPageSnapshots, pages, currentPageIndex, filename) => {
  if (!canvas) return;

  if (format === 'svg') {
    const svg = canvas.toSVG();
    download(svg, `${filename}.svg`, 'image/svg+xml');
    return;
  }

  if (format === 'png') {
    const url = canvas.toDataURL({ format: 'png', multiplier: 2 });
    download(url, `${filename}.png`);
    return;
  }

  if (format === 'jpg') {
    const url = canvas.toDataURL({ format: 'jpeg', quality: 0.92, multiplier: 2 });
    download(url, `${filename}.jpg`);
    return;
  }

  if (format === 'pdf') {
    // Multi-page PDF: render ALL pages
    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const orient = canvasW >= canvasH ? 'landscape' : 'portrait';

    const pdf = new jsPDF({
      orientation: orient, unit: 'px',
      format: [canvasW, canvasH],
      hotfixes: ['px_scaling'],
    });

    // Save current page snapshot before export
    const currentSnap = JSON.stringify(canvas.toJSON());

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) pdf.addPage([canvasW, canvasH], orient);

      let snap;
      if (i === currentPageIndex) {
        snap = currentSnap;
      } else {
        snap = allPageSnapshots[pages[i].id];
      }

      if (snap) {
        // Create a temporary off-screen canvas to render this page
        const tempEl = document.createElement('canvas');
        tempEl.width  = canvasW;
        tempEl.height = canvasH;
        const tempCanvas = new fabric.Canvas(tempEl, { width: canvasW, height: canvasH });
        try {
          await tempCanvas.loadFromJSON(JSON.parse(snap));
          tempCanvas.renderAll();
          const dataUrl = tempCanvas.toDataURL({ format: 'png', multiplier: 1 });
          pdf.addImage(dataUrl, 'PNG', 0, 0, canvasW, canvasH);
        } finally {
          tempCanvas.dispose();
        }
      } else {
        // Blank page — render current canvas background
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, canvasW, canvasH, 'F');
      }
    }

    pdf.save(`${filename}.pdf`);
  }
};

// ── Thumbnail ────────────────────────────────────────────────
const generateThumbnail = (canvas) => {
  if (!canvas) return null;
  try {
    return canvas.toDataURL({ format: 'jpeg', quality: 0.35, multiplier: 0.18 });
  } catch { return null; }
};

// ── Compute editor canvas scale ──────────────────────────────
const computeScale = (w, h) => {
  const vw = Math.max(window.innerWidth  - 520, 400);
  const vh = Math.max(window.innerHeight - 100, 300);
  return Math.min(vw / w, vh / h, 1);
};

// ── Alignment helper ─────────────────────────────────────────
const alignOnCanvas = (canvas, direction) => {
  if (!canvas) return;
  const obj = canvas.getActiveObject();
  if (!obj) return;
  const cw = canvas.width, ch = canvas.height;

  const process = (o) => {
    const ow = o.getScaledWidth(), oh = o.getScaledHeight();
    switch (direction) {
      case 'left':   o.set('left', 0);               break;
      case 'centerH':o.set('left', (cw - ow) / 2);   break;
      case 'right':  o.set('left', cw - ow);          break;
      case 'top':    o.set('top',  0);                break;
      case 'centerV':o.set('top',  (ch - oh) / 2);   break;
      case 'bottom': o.set('top',  ch - oh);          break;
    }
    o.setCoords();
  };

  if (obj.type === 'activeselection') {
    obj.forEachObject(process);
  } else {
    process(obj);
  }
  canvas.renderAll();
  canvas.fire('object:modified', { target: obj });
};

// ── Apply template objects to canvas ────────────────────────
const applyTemplate = async (canvas, template, scale) => {
  canvas.clear();
  canvas.setBackgroundColor(template.bg, () => {});

  for (const objDef of template.objects) {
    const { type, ...props } = objDef;

    // Scale all positional/size properties
    const scaled = {};
    for (const [k, v] of Object.entries(props)) {
      if (['left','top','width','height','radius','fontSize','strokeWidth'].includes(k) && typeof v === 'number') {
        scaled[k] = v * scale;
      } else {
        scaled[k] = v;
      }
    }

    let obj;
    if (type === 'rect')   obj = new fabric.Rect(scaled);
    else if (type === 'circle') obj = new fabric.Circle(scaled);
    else if (type === 'i-text' || type === 'textbox') {
      obj = new fabric.IText(scaled.text || '', { ...scaled });
    }
    if (obj) canvas.add(obj);
  }

  canvas.renderAll();
};


// ═══════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
const EditorPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const getProject    = useAppStore((s) => s.getProject);
  const updateProject = useAppStore((s) => s.updateProject);

  const [project, setProject] = useState(null);
  const [pages,   setPages]   = useState([createBlankPage()]);
  const [pageIdx, setPageIdx] = useState(0);
  const [snaps,   setSnaps]   = useState({});  // pageId → canvas JSON string

  const canvasElRef = useRef(null);
  const [canvas,   setCanvas]   = useState(null);
  const [zoom,     setZoom]     = useState(1);

  const [selectedObj,    setSelectedObj]    = useState(null);
  const [hasSelection,   setHasSelection]   = useState(false);
  const [canvasObjects,  setCanvasObjects]  = useState([]);
  const [isDirty,        setIsDirty]        = useState(false);

  const autoSaveTimer = useRef(null);
  const { undo, redo, canUndo, canRedo } = useCanvasHistory(canvas);

  // Refs so keyboard handler always has latest callbacks
  const cbs = useRef({});

  const refreshObjects = useCallback((c) => setCanvasObjects([...c.getObjects()]), []);

  const markDirty = useCallback(() => {
    setIsDirty(true);
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => cbs.current.save?.(), 3000);
  }, []);

  // ── Load project ─────────────────────────────────────────
  useEffect(() => {
    if (!id) { navigate('/dashboard'); return; }
    const proj = getProject(id);
    if (!proj) { navigate('/dashboard'); return; }
    setProject(proj);
    setPages(proj.pages?.length ? proj.pages : [createBlankPage()]);
    setPageIdx(proj.currentPageIndex || 0);
    const initSnaps = {};
    (proj.pages || []).forEach((p) => { if (p.canvasJSON) initSnaps[p.id] = p.canvasJSON; });
    setSnaps(initSnaps);
  }, [id, getProject, navigate]);

  // ── Canvas init ───────────────────────────────────────────
  useEffect(() => {
    if (!project || !canvasElRef.current) return;

    const scale = computeScale(project.width, project.height);
    setZoom(scale);

    const w = Math.round(project.width  * scale);
    const h = Math.round(project.height * scale);

    const c = new fabric.Canvas(canvasElRef.current, {
      width: w, height: h,
      backgroundColor: project.background || '#ffffff',
      preserveObjectStacking: true,
      selection: true,
    });

    // Selection events
    const onSel = () => {
      const obj = c.getActiveObject();
      setSelectedObj(obj || null);
      setHasSelection(!!obj);
      refreshObjects(c);
    };
    c.on('selection:created', onSel);
    c.on('selection:updated', onSel);
    c.on('selection:cleared', () => { setSelectedObj(null); setHasSelection(false); });
    c.on('object:added',    () => refreshObjects(c));
    c.on('object:removed',  () => refreshObjects(c));
    c.on('object:modified', () => { refreshObjects(c); markDirty(); });

    setCanvas(c);

    // Load page snapshot or apply template from URL param
    const templateId = searchParams.get('template');
    const pageSnap = (project.pages?.[project.currentPageIndex || 0])?.canvasJSON
      || snaps[pages[pageIdx]?.id];

    if (pageSnap) {
      c.loadFromJSON(JSON.parse(pageSnap)).then(() => c.renderAll());
    } else if (templateId) {
      const tmpl = TEMPLATE_CATALOG.find((t) => t.id === templateId);
      if (tmpl) applyTemplate(c, tmpl, scale);
    }

    return () => {
      c.dispose();
      setCanvas(null);
      setSelectedObj(null);
      setHasSelection(false);
    };
  }, [project, searchParams, snaps, pages, pageIdx, refreshObjects, markDirty]);

  // ── Keyboard shortcuts ────────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (!canvas) return;
      const active = canvas.getActiveObject();
      if (active?.isEditing) return;

      const ctrl = e.ctrlKey || e.metaKey;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault(); cbs.current.deleteSelected?.();
      }
      if (ctrl && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
      if (ctrl && e.key === 'd') { e.preventDefault(); cbs.current.duplicate?.(); }
      if (ctrl && e.key === 's') { e.preventDefault(); cbs.current.save?.(); }
      if (ctrl && e.key === 'a') {
        e.preventDefault();
        const objs = canvas.getObjects();
        if (objs.length) {
          const sel = new fabric.ActiveSelection(objs, { canvas });
          canvas.setActiveObject(sel);
          canvas.renderAll();
        }
      }
      if (ctrl && e.key === 'g') { e.preventDefault(); cbs.current.group?.(); }
      if (ctrl && e.shiftKey && e.key === 'G') { e.preventDefault(); cbs.current.ungroup?.(); }
      // Nudge
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key) && active) {
        e.preventDefault();
        const d = e.shiftKey ? 10 : 1;
        if (e.key === 'ArrowUp')    active.set('top',  active.top  - d);
        if (e.key === 'ArrowDown')  active.set('top',  active.top  + d);
        if (e.key === 'ArrowLeft')  active.set('left', active.left - d);
        if (e.key === 'ArrowRight') active.set('left', active.left + d);
        active.setCoords(); canvas.renderAll();
        canvas.fire('object:modified', { target: active });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [canvas, undo, redo]);

  // ── Canvas operations ─────────────────────────────────────

  const makeStarPoints = (n, outer, inner) => {
    const pts = [];
    for (let i = 0; i < n * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (Math.PI / n) * i - Math.PI / 2;
      pts.push({ x: r * Math.cos(a), y: r * Math.sin(a) });
    }
    return pts;
  };

  const addShape = useCallback((shapeId) => {
    if (!canvas) return;
    const cx = canvas.width / 2, cy = canvas.height / 2;
    let obj;
    switch (shapeId) {
      case 'rect':     obj = new fabric.Rect({ left: cx-70, top: cy-52, width: 140, height: 104, fill: '#9b8ef4', rx: 6, ry: 6 }); break;
      case 'rect-r':   obj = new fabric.Rect({ left: cx-70, top: cy-52, width: 140, height: 104, fill: '#4fc3f7', rx: 30, ry: 30 }); break;
      case 'circle':   obj = new fabric.Circle({ left: cx-60, top: cy-60, radius: 60, fill: '#c8f135' }); break;
      case 'ellipse':  obj = new fabric.Ellipse({ left: cx-80, top: cy-40, rx: 80, ry: 40, fill: '#ff5f41' }); break;
      case 'triangle': obj = new fabric.Triangle({ left: cx-60, top: cy-60, width: 120, height: 120, fill: '#fbbf24' }); break;
      case 'line':     obj = new fabric.Line([cx-80, cy, cx+80, cy], { stroke: '#c8f135', strokeWidth: 4 }); break;
      case 'arrow':
        obj = new fabric.Polygon([
          {x:0,y:20},{x:70,y:20},{x:70,y:0},{x:100,y:35},{x:70,y:70},{x:70,y:50},{x:0,y:50}
        ], { left: cx-50, top: cy-35, fill: '#9b8ef4' });
        break;
      case 'star':
        obj = new fabric.Polygon(makeStarPoints(5, 70, 28), { left: cx-70, top: cy-70, fill: '#c8f135' });
        break;
      case 'hexagon':
        obj = new fabric.Polygon(makeStarPoints(6, 70, 70), { left: cx-70, top: cy-70, fill: '#4fc3f7' });
        break;
      default: return;
    }
    // Note: Do NOT call saveHistory() here — useCanvasHistory event listener handles it
    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.renderAll();
  }, [canvas]);

  const addText = useCallback(({ fontSize = 28, fontWeight = '400', fontFamily = 'Inter', text = 'Your text here' } = {}) => {
    if (!canvas) return;
    const itext = new fabric.IText(text, {
      left: canvas.width / 2, top: canvas.height / 2,
      originX: 'center', originY: 'center',
      fontSize, fontWeight, fontFamily, fill: '#111827',
    });
    canvas.add(itext);
    canvas.setActiveObject(itext);
    canvas.renderAll();
  }, [canvas]);

  const uploadImage = useCallback((file) => {
    if (!canvas) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const fi = new fabric.FabricImage(img);
        const maxDim = Math.min(canvas.width, canvas.height) * 0.65;
        const s = Math.min(maxDim / img.width, maxDim / img.height, 1);
        fi.scale(s);
        fi.set({
          left: (canvas.width  - img.width  * s) / 2,
          top:  (canvas.height - img.height * s) / 2,
        });
        canvas.add(fi);
        canvas.setActiveObject(fi);
        canvas.renderAll();
      };
      img.onerror = () => alert('Could not load image. Check the file format.');
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, [canvas]);

  const deleteSelected = useCallback(() => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    if (active.type === 'activeselection') {
      active.forEachObject((o) => canvas.remove(o));
      canvas.discardActiveObject();
    } else {
      canvas.remove(active);
    }
    canvas.renderAll();
    setSelectedObj(null); setHasSelection(false);
  }, [canvas]);

  const duplicateSelected = useCallback(() => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    active.clone().then((cloned) => {
      cloned.set({ left: active.left + 18, top: active.top + 18 });
      if (cloned.type === 'activeselection') {
        cloned.canvas = canvas;
        cloned.forEachObject((o) => canvas.add(o));
        cloned.setCoords();
      } else {
        canvas.add(cloned);
      }
      canvas.setActiveObject(cloned);
      canvas.renderAll();
    });
  }, [canvas]);

  const groupSelected = useCallback(() => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active || active.type !== 'activeselection') return;
    const group = active.toGroup();
    canvas.setActiveObject(group);
    canvas.renderAll();
  }, [canvas]);

  const ungroupSelected = useCallback(() => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active || active.type !== 'group') return;
    const sel = active.toActiveSelection();
    canvas.setActiveObject(sel);
    canvas.renderAll();
  }, [canvas]);

  // Z-order
  const bringForward  = useCallback(() => { const o = canvas?.getActiveObject(); if(o){canvas.bringObjectForward(o);canvas.renderAll();} }, [canvas]);
  const sendBackward  = useCallback(() => { const o = canvas?.getActiveObject(); if(o){canvas.sendObjectBackwards(o);canvas.renderAll();} }, [canvas]);
  const bringToFront  = useCallback(() => { const o = canvas?.getActiveObject(); if(o){canvas.bringObjectToFront(o);canvas.renderAll();} }, [canvas]);
  const sendToBack    = useCallback(() => { const o = canvas?.getActiveObject(); if(o){canvas.sendObjectToBack(o);canvas.renderAll();} }, [canvas]);

  const setCanvasBg   = useCallback((color) => {
    if (!canvas) return;
    canvas.setBackgroundColor(color, () => canvas.renderAll());
    markDirty();
  }, [canvas, markDirty]);

  // ── Pages ─────────────────────────────────────────────────
  const saveCurrentPage = useCallback(() => {
    if (!canvas || !pages[pageIdx]) return;
    const json = JSON.stringify(canvas.toJSON());
    const thumb = generateThumbnail(canvas);
    const pageId = pages[pageIdx].id;
    setSnaps((prev) => ({ ...prev, [pageId]: json }));
    setPages((prev) => prev.map((p, i) => i === pageIdx ? { ...p, canvasJSON: json, thumbnail: thumb } : p));
    return json;
  }, [canvas, pages, pageIdx]);

  const switchPage = useCallback(async (newIdx) => {
    if (!canvas || newIdx === pageIdx) return;
    saveCurrentPage();
    const newPage = pages[newIdx];
    const snap = snaps[newPage?.id];
    canvas.clear();
    canvas.setBackgroundColor(project?.background || '#ffffff', () => {});
    if (snap) {
      await canvas.loadFromJSON(JSON.parse(snap));
    }
    canvas.renderAll();
    setPageIdx(newIdx);
    setSelectedObj(null); setHasSelection(false);
    refreshObjects(canvas);
  }, [canvas, pageIdx, pages, snaps, project, saveCurrentPage]);

  const addPage = useCallback(() => {
    saveCurrentPage();
    const newPage = createBlankPage();
    const newPages = [...pages, newPage];
    setPages(newPages);
    canvas.clear();
    canvas.setBackgroundColor(project?.background || '#ffffff', () => {});
    canvas.renderAll();
    setPageIdx(newPages.length - 1);
    setSelectedObj(null); setHasSelection(false);
    refreshObjects(canvas);
  }, [canvas, pages, project, saveCurrentPage]);

  const duplicatePage = useCallback((idx) => {
    saveCurrentPage();
    const src = pages[idx];
    const json = snaps[src.id] || null;
    const newPage = { ...createBlankPage(), canvasJSON: json };
    const newSnaps = { ...snaps, [newPage.id]: json };
    const newPages = [...pages.slice(0, idx + 1), newPage, ...pages.slice(idx + 1)];
    setPages(newPages); setSnaps(newSnaps);
    const newIdx = idx + 1;
    canvas.clear();
    if (json) canvas.loadFromJSON(JSON.parse(json)).then(() => canvas.renderAll());
    else canvas.renderAll();
    setPageIdx(newIdx);
  }, [canvas, pages, snaps, saveCurrentPage]);

  const deletePage = useCallback((idx) => {
    if (pages.length === 1) return;
    const newPages = pages.filter((_, i) => i !== idx);
    const newSnaps = { ...snaps };
    delete newSnaps[pages[idx].id];
    setPages(newPages); setSnaps(newSnaps);
    const newIdx = Math.min(pageIdx, newPages.length - 1);
    const snap = newSnaps[newPages[newIdx]?.id];
    canvas.clear();
    if (snap) canvas.loadFromJSON(JSON.parse(snap)).then(() => canvas.renderAll());
    else canvas.renderAll();
    setPageIdx(newIdx);
  }, [canvas, pages, snaps, pageIdx]);

  const renamePage = useCallback((idx, name) => {
    setPages((prev) => prev.map((p, i) => i === idx ? { ...p, name } : p));
  }, []);

  // ── Save ──────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    if (!canvas || !project) return;
    const currentJson = JSON.stringify(canvas.toJSON());
    const thumb = generateThumbnail(canvas);
    const updatedPages = pages.map((p, i) => {
      if (i === pageIdx) return { ...p, canvasJSON: currentJson, thumbnail: thumb };
      return { ...p, canvasJSON: snaps[p.id] || p.canvasJSON };
    });
    updateProject(project.id, {
      pages: updatedPages, currentPageIndex: pageIdx, thumbnail: thumb,
    });
    setIsDirty(false);
  }, [canvas, project, pages, pageIdx, snaps, updateProject]);

  const handleLoadTemplate = useCallback((template) => {
    if (!canvas) return;
    const scale = computeScale(template.w, template.h);
    canvas.setWidth(Math.round(template.w * scale));
    canvas.setHeight(Math.round(template.h * scale));
    setZoom(scale);
    applyTemplate(canvas, template, scale);
    markDirty();
  }, [canvas, markDirty]);

  const handleSelectObject = useCallback((obj) => {
    if (!canvas) return;
    canvas.setActiveObject(obj);
    canvas.renderAll();
    setSelectedObj(obj);
    setHasSelection(true);
  }, [canvas]);

  const handleToggleVisible = useCallback((obj) => {
    if (!canvas) return;
    obj.set('visible', !obj.visible);
    canvas.renderAll();
    setCanvasObjects((prev) => [...prev]);
  }, [canvas]);

  // ── Zoom ──────────────────────────────────────────────────
  const handleZoomIn    = useCallback(() => setZoom((z) => Math.min(z + 0.1, 4)), []);
  const handleZoomOut   = useCallback(() => setZoom((z) => Math.max(z - 0.1, 0.1)), []);
  const handleZoomReset = useCallback(() => {
    if (project) setZoom(computeScale(project.width, project.height));
  }, [project]);
  const handleZoomFit   = handleZoomReset;

  // ── Sync callback refs ────────────────────────────────────
  useEffect(() => {
    cbs.current.deleteSelected = deleteSelected;
    cbs.current.duplicate      = duplicateSelected;
    cbs.current.save           = handleSave;
    cbs.current.group          = groupSelected;
    cbs.current.ungroup        = ungroupSelected;
  });

  // ── Canvas resize when zoom changes ──────────────────────
  useEffect(() => {
    if (!canvas || !project) return;
    const w = Math.round(project.width  * zoom);
    const h = Math.round(project.height * zoom);
    canvas.setWidth(w); canvas.setHeight(h);
    canvas.renderAll();
  }, [zoom, canvas, project]);

  // ── Render ────────────────────────────────────────────────
  if (!project) {
    return (
      <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#1c1c2a' }}>
        <div className="prn-spinner prn-spinner--light" aria-label="Loading editor…" />
      </div>
    );
  }

  return (
    <div className="editor-layout">
      <EditorTopbar
        title={project.title}
        onTitleChange={(t) => { updateProject(project.id, { title: t }); setProject((p) => ({ ...p, title: t })); }}
        canUndo={canUndo} canRedo={canRedo} onUndo={undo} onRedo={redo}
        hasSelection={hasSelection}
        selectedObj={selectedObj}
        onDelete={deleteSelected}
        onDuplicate={duplicateSelected}
        onGroup={groupSelected}
        onUngroup={ungroupSelected}
        onBringForward={bringForward}
        onSendBackward={sendBackward}
        onBringToFront={bringToFront}
        onSendToBack={sendToBack}
        onAlignH={(d) => alignOnCanvas(canvas, d)}
        onAlignV={(d) => alignOnCanvas(canvas, d)}
        onExport={(fmt) => exportCanvas(canvas, fmt, snaps, pages, pageIdx, slugify(project.title))}
        onSave={handleSave}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onZoomFit={handleZoomFit}
        isDirty={isDirty}
      />

      <div className="editor-body">
        <WorkbenchPanel
          canvas={canvas}
          onAddShape={addShape}
          onAddText={addText}
          onUploadImage={uploadImage}
          onLoadTemplate={handleLoadTemplate}
          pages={pages}
          pageIdx={pageIdx}
          onAddPage={addPage}
          onDuplicatePage={duplicatePage}
          onDeletePage={deletePage}
          onRenamePage={renamePage}
          onSelectPage={switchPage}
          canvasObjects={canvasObjects}
          selectedObj={selectedObj}
          onSelectObject={handleSelectObject}
          onToggleVisible={handleToggleVisible}
          onBringForward={bringForward}
          onSendBackward={sendBackward}
          onBringToFront={bringToFront}
          onSendToBack={sendToBack}
          onSetCanvasBg={setCanvasBg}
          canvasWidth={project.width}
          canvasHeight={project.height}
        />

        <main className="editor-workspace" role="main" aria-label="Design canvas">
          <div
            className="editor-canvas-wrapper"
            style={{
              width:  Math.round(project.width  * zoom),
              height: Math.round(project.height * zoom),
            }}
          >
            <canvas ref={canvasElRef} aria-label="Design canvas" />
          </div>

          {isDirty && (
            <div className="editor-status" role="status" aria-live="polite">
              Unsaved changes
            </div>
          )}

          <div className="editor-zoom-bar" role="group" aria-label="Zoom controls">
            <button className="btn-icon-dark btn" style={{width:26,height:26}} onClick={handleZoomOut} title="Zoom out (−)">−</button>
            <button className="editor-zoom-value" onClick={handleZoomReset} title="Reset zoom">
              {Math.round(zoom * 100)}%
            </button>
            <button className="btn-icon-dark btn" style={{width:26,height:26}} onClick={handleZoomIn} title="Zoom in (+)">+</button>
          </div>
        </main>

        <Inspector
          canvas={canvas}
          selectedObj={selectedObj}
          onSetCanvasBg={setCanvasBg}
          canvasWidth={project.width}
          canvasHeight={project.height}
        />
      </div>
    </div>
  );
};

export default EditorPage;