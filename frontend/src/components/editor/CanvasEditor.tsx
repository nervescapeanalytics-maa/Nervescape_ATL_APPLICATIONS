import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

type Tool = 'select' | 'draw' | 'rect' | 'circle' | 'line' | 'text' | 'eraser';

interface Props {
  initialDataUrl?: string;
  onSave: (dataUrl: string) => void;
  onClose: () => void;
}

export default function CanvasEditor({ initialDataUrl, onSave, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [tool, setTool] = useState<Tool>('select');
  const [color, setColor] = useState('#6366f1');
  const [brushSize, setBrushSize] = useState(4);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);

  function pushHistory() {
    const c = fabricRef.current;
    if (!c) return;
    const json = JSON.stringify(c.toJSON());
    setHistory((prev) => {
      const next = prev.slice(0, histIdx + 1);
      next.push(json);
      return next.slice(-30);
    });
    setHistIdx((i) => Math.min(i + 1, 29));
  }

  useEffect(() => {
    if (!canvasRef.current) return;
    const c = new fabric.Canvas(canvasRef.current, { width: 800, height: 500, backgroundColor: '#ffffff', isDrawingMode: false });
    fabricRef.current = c;

    if (initialDataUrl) {
      fabric.Image.fromURL(initialDataUrl, (img) => {
        const scale = Math.min(800 / (img.width || 800), 500 / (img.height || 500), 1);
        img.scale(scale);
        c.setBackgroundImage(img, c.renderAll.bind(c));
      });
    }

    c.on('object:added', () => setTimeout(pushHistory, 50));
    c.on('object:modified', () => setTimeout(pushHistory, 50));
    pushHistory();

    return () => { c.dispose(); fabricRef.current = null; };
  }, []);

  useEffect(() => {
    const c = fabricRef.current;
    if (!c) return;
    c.isDrawingMode = tool === 'draw' || tool === 'eraser';
    if (c.isDrawingMode && c.freeDrawingBrush) {
      c.freeDrawingBrush.color = tool === 'eraser' ? '#ffffff' : color;
      c.freeDrawingBrush.width = tool === 'eraser' ? brushSize * 3 : brushSize;
    }
    c.selection = tool === 'select';
  }, [tool, color, brushSize]);

  function addShape(shape: 'rect' | 'circle' | 'line') {
    const c = fabricRef.current;
    if (!c) return;
    let obj: fabric.Object;
    if (shape === 'rect') obj = new fabric.Rect({ left: 100, top: 100, width: 120, height: 80, fill: color + '66', stroke: color, strokeWidth: 2 });
    else if (shape === 'circle') obj = new fabric.Circle({ left: 150, top: 120, radius: 50, fill: color + '66', stroke: color, strokeWidth: 2 });
    else obj = new fabric.Line([50, 50, 200, 200], { stroke: color, strokeWidth: brushSize });
    c.add(obj);
    c.setActiveObject(obj);
  }

  function addText() {
    const c = fabricRef.current;
    if (!c) return;
    const t = new fabric.IText('Text box', { left: 120, top: 140, fontSize: 22, fill: color, fontFamily: 'Inter, Arial, sans-serif' });
    c.add(t);
    c.setActiveObject(t);
    t.enterEditing();
  }

  function undo() {
    if (histIdx <= 0) return;
    const c = fabricRef.current;
    if (!c) return;
    const idx = histIdx - 1;
    c.loadFromJSON(history[idx], () => { c.renderAll(); setHistIdx(idx); });
  }

  function redo() {
    if (histIdx >= history.length - 1) return;
    const c = fabricRef.current;
    if (!c) return;
    const idx = histIdx + 1;
    c.loadFromJSON(history[idx], () => { c.renderAll(); setHistIdx(idx); });
  }

  function rotateSelected(deg: number) {
    const c = fabricRef.current;
    const obj = c?.getActiveObject();
    if (obj) { obj.rotate((obj.angle || 0) + deg); c?.renderAll(); pushHistory(); }
  }

  function scaleSelected(factor: number) {
    const c = fabricRef.current;
    const obj = c?.getActiveObject();
    if (obj) { obj.scale((obj.scaleX || 1) * factor); c?.renderAll(); pushHistory(); }
  }

  function deleteSelected() {
    const c = fabricRef.current;
    const obj = c?.getActiveObject();
    if (c && obj) { c.remove(obj); pushHistory(); }
  }

  function handleSave() {
    const c = fabricRef.current;
    if (!c) return;
    onSave(c.toDataURL({ format: 'png', quality: 0.92, multiplier: 1 }));
  }

  const tb = (t: Tool, label: string, title: string) => (
    <button type="button" key={t} className={`rte-btn${tool === t ? ' active' : ''}`} title={title} onClick={() => setTool(t)}>{label}</button>
  );

  return (
    <div className="canvas-editor-overlay" onClick={onClose}>
      <div className="canvas-editor-panel" onClick={(e) => e.stopPropagation()}>
        <div className="row between" style={{ marginBottom: 10 }}>
          <h3 style={{ margin: 0 }}>🎨 Drawing Studio</h3>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>

        <div className="rte-toolbar" style={{ flexWrap: 'wrap', marginBottom: 10 }}>
          <div className="rte-group">{tb('select', '↖', 'Select')}{tb('draw', '✏️', 'Draw')}{tb('eraser', '🧹', 'Eraser')}</div>
          <div className="rte-group">
            <button type="button" className="rte-btn" title="Rectangle" onClick={() => { setTool('select'); addShape('rect'); }}>▭</button>
            <button type="button" className="rte-btn" title="Circle" onClick={() => { setTool('select'); addShape('circle'); }}>○</button>
            <button type="button" className="rte-btn" title="Line" onClick={() => { setTool('select'); addShape('line'); }}>╱</button>
            <button type="button" className="rte-btn" title="Text box" onClick={() => { setTool('select'); addText(); }}>T</button>
          </div>
          <div className="rte-group">
            <label className="rte-color"><span>◼</span><input type="color" value={color} onChange={(e) => setColor(e.target.value)} /></label>
            <input type="range" min={1} max={20} value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} style={{ width: 70 }} title="Brush size" />
          </div>
          <div className="rte-group">
            <button type="button" className="rte-btn" title="Undo" onClick={undo} disabled={histIdx <= 0}>↩</button>
            <button type="button" className="rte-btn" title="Redo" onClick={redo} disabled={histIdx >= history.length - 1}>↪</button>
            <button type="button" className="rte-btn" title="Rotate left" onClick={() => rotateSelected(-15)}>↺</button>
            <button type="button" className="rte-btn" title="Rotate right" onClick={() => rotateSelected(15)}>↻</button>
            <button type="button" className="rte-btn" title="Enlarge" onClick={() => scaleSelected(1.1)}>＋</button>
            <button type="button" className="rte-btn" title="Shrink" onClick={() => scaleSelected(0.9)}>－</button>
            <button type="button" className="rte-btn danger" title="Delete" onClick={deleteSelected}>🗑</button>
          </div>
        </div>

        <div className="canvas-editor-frame">
          <canvas ref={canvasRef} />
        </div>

        <div className="row" style={{ gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={handleSave}>💾 Insert Drawing</button>
        </div>
      </div>
    </div>
  );
}
