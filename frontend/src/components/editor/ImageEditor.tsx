import { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
  onSave: (dataUrl: string) => void;
  onClose: () => void;
}

export default function ImageEditor({ src, onSave, onClose }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 100, h: 100 }); // percentages

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    img.onload = () => setCrop({ x: 0, y: 0, w: 100, h: 100 });
    if (img.complete) setCrop({ x: 0, y: 0, w: 100, h: 100 });
  }, [src]);

  function exportImage() {
    const img = imgRef.current;
    if (!img || !img.naturalWidth) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sx = (crop.x / 100) * img.naturalWidth;
    const sy = (crop.y / 100) * img.naturalHeight;
    const sw = (crop.w / 100) * img.naturalWidth;
    const sh = (crop.h / 100) * img.naturalHeight;

    const rad = (rotation * Math.PI) / 180;
    const w = Math.abs(sw * scale * Math.cos(rad)) + Math.abs(sh * scale * Math.sin(rad));
    const h = Math.abs(sw * scale * Math.sin(rad)) + Math.abs(sh * scale * Math.cos(rad));
    canvas.width = Math.max(1, Math.round(w));
    canvas.height = Math.max(1, Math.round(h));

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rad);
    ctx.scale(scale, scale);
    ctx.drawImage(img, sx, sy, sw, sh, -sw / 2, -sh / 2, sw, sh);
    onSave(canvas.toDataURL('image/png', 0.92));
  }

  return (
    <div className="canvas-editor-overlay" onClick={onClose}>
      <div className="canvas-editor-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720 }}>
        <div className="row between" style={{ marginBottom: 10 }}>
          <h3 style={{ margin: 0 }}>🖼 Image Editor</h3>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 12, background: '#f1f5f9', borderRadius: 8, padding: 12, overflow: 'hidden' }}>
          <img ref={imgRef} src={src} alt="" style={{ maxWidth: '100%', maxHeight: 280, transform: `rotate(${rotation}deg) scale(${scale})`, transition: 'transform .2s' }} />
        </div>

        <div className="grid2" style={{ gap: 10 }}>
          <div className="field"><label>Rotate ({rotation}°)</label>
            <input type="range" min={-180} max={180} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} />
          </div>
          <div className="field"><label>Scale ({Math.round(scale * 100)}%)</label>
            <input type="range" min={0.2} max={2} step={0.05} value={scale} onChange={(e) => setScale(Number(e.target.value))} />
          </div>
          <div className="field"><label>Crop left ({crop.x}%)</label>
            <input type="range" min={0} max={50} value={crop.x} onChange={(e) => setCrop({ ...crop, x: Number(e.target.value) })} />
          </div>
          <div className="field"><label>Crop top ({crop.y}%)</label>
            <input type="range" min={0} max={50} value={crop.y} onChange={(e) => setCrop({ ...crop, y: Number(e.target.value) })} />
          </div>
          <div className="field"><label>Crop width ({crop.w}%)</label>
            <input type="range" min={20} max={100} value={crop.w} onChange={(e) => setCrop({ ...crop, w: Number(e.target.value) })} />
          </div>
          <div className="field"><label>Crop height ({crop.h}%)</label>
            <input type="range" min={20} max={100} value={crop.h} onChange={(e) => setCrop({ ...crop, h: Number(e.target.value) })} />
          </div>
        </div>

        <div className="row" style={{ gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={exportImage}>✓ Apply</button>
        </div>
      </div>
    </div>
  );
}
