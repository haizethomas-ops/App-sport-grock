import { useRef } from "react";
import type { Placement } from "../types";

type Props = { photoUrl: string; logoUrl?: string; placement: Placement; editable?: boolean; onChange?: (next: Placement) => void };

export function PatchCanvas({ photoUrl, logoUrl, placement, editable, onChange }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const mode = useRef<"move" | "resize" | null>(null);
  function point(e: React.PointerEvent) {
    const el = root.current; if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
  }
  function onPointerDown(e: React.PointerEvent, kind: "move" | "resize") {
    if (!editable || !onChange) return;
    e.preventDefault(); e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    mode.current = kind;
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!editable || !onChange || !mode.current) return;
    const p = point(e);
    if (mode.current === "move") {
      onChange({ ...placement, x: clamp(p.x - placement.width / 2, 0, 100 - placement.width), y: clamp(p.y - placement.height / 2, 0, 100 - placement.height) });
    } else {
      const width = clamp(p.x - placement.x, 6, 60);
      const ratio = placement.width > 0 ? placement.height / placement.width : 0.55;
      onChange({ ...placement, width, height: clamp(width * ratio, 4, 50) });
    }
  }
  return (
    <div ref={root} className="photo-canvas" onPointerMove={onPointerMove} onPointerUp={() => { mode.current = null; }} onPointerCancel={() => { mode.current = null; }}>
      <img className="base" src={photoUrl} alt="" />
      <div className={`patch-box ${editable ? "active" : ""}`} style={{ left: `${placement.x}%`, top: `${placement.y}%`, width: `${placement.width}%`, height: `${placement.height}%`, transform: `rotate(${placement.rotation}deg)`, transformOrigin: "center center" }} onPointerDown={(e) => onPointerDown(e, "move")}>
        {logoUrl ? <img src={logoUrl} alt="logo" /> : <span className="dim">Zone</span>}
        {editable && <div className="patch-handle" onPointerDown={(e) => onPointerDown(e, "resize")} />}
      </div>
    </div>
  );
}
function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)); }
