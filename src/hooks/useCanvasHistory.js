/**
 * PRN – useCanvasHistory
 * Undo/redo via JSON snapshots. History capped at 60 states.
 *
 * FIX: Removed double-save issue. This hook wires its own canvas event listeners.
 * Callers (EditorPage) should NOT call saveHistory() manually after add/modify/remove —
 * the listeners handle it automatically. Only call saveHistory() for operations that
 * DON'T fire canvas events (e.g., programmatic property changes without event dispatch).
 */
import { useEffect, useRef, useState, useCallback } from 'react';

const MAX_HISTORY = 60;

const useCanvasHistory = (canvas) => {
  const historyRef      = useRef([]);
  const stepRef         = useRef(-1);
  const isMutating      = useRef(false);  // true while undo/redo is in progress

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const syncFlags = useCallback(() => {
    setCanUndo(stepRef.current > 0);
    setCanRedo(stepRef.current < historyRef.current.length - 1);
  }, []);

  // Capture initial state once canvas is ready
  useEffect(() => {
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON());
    historyRef.current = [json];
    stepRef.current = 0;
    syncFlags();
  }, [canvas, syncFlags]);

  /**
   * saveHistory: push a new snapshot.
   * Guards against saves during undo/redo playback.
   * Also deduplicates: if the new JSON is identical to the current snapshot, skip.
   */
  const saveHistory = useCallback(() => {
    if (!canvas || isMutating.current) return;
    const json = JSON.stringify(canvas.toJSON());
    const current = historyRef.current[stepRef.current];
    if (json === current) return;  // deduplicate

    const trimmed = historyRef.current.slice(0, stepRef.current + 1);
    trimmed.push(json);
    if (trimmed.length > MAX_HISTORY) trimmed.shift();
    historyRef.current = trimmed;
    stepRef.current = trimmed.length - 1;
    syncFlags();
  }, [canvas, syncFlags]);

  // Wire canvas events — ONE set of listeners, no duplication
  useEffect(() => {
    if (!canvas) return;
    canvas.on('object:added',    saveHistory);
    canvas.on('object:modified', saveHistory);
    canvas.on('object:removed',  saveHistory);
    return () => {
      canvas.off('object:added',    saveHistory);
      canvas.off('object:modified', saveHistory);
      canvas.off('object:removed',  saveHistory);
    };
  }, [canvas, saveHistory]);

  const undo = useCallback(async () => {
    if (stepRef.current <= 0 || !canvas) return;
    isMutating.current = true;
    const step = stepRef.current - 1;
    stepRef.current = step;
    try {
      await canvas.loadFromJSON(JSON.parse(historyRef.current[step]));
      canvas.renderAll();
    } finally {
      isMutating.current = false;
    }
    syncFlags();
  }, [canvas, syncFlags]);

  const redo = useCallback(async () => {
    if (stepRef.current >= historyRef.current.length - 1 || !canvas) return;
    isMutating.current = true;
    const step = stepRef.current + 1;
    stepRef.current = step;
    try {
      await canvas.loadFromJSON(JSON.parse(historyRef.current[step]));
      canvas.renderAll();
    } finally {
      isMutating.current = false;
    }
    syncFlags();
  }, [canvas, syncFlags]);

  return { undo, redo, saveHistory, canUndo, canRedo };
};

export default useCanvasHistory;
