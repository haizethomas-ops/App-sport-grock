import { useMemo, useState } from "react";
import { PatchCanvas } from "../../components/PatchCanvas";
import { useStore } from "../../store/StoreContext";
import { DEFAULT_PATCHES, ZONE_LABEL, type Patch, type PatchZone } from "../../types";
import { isPatchLocked } from "../../lib/deals";
import { money, uid } from "../../lib/id";

export function AthleteInventory() {
  const { currentAthlete, upsertPatch, removePatch, state } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<Patch["placement"][]>([]);
  const [redo, setRedo] = useState<Patch["placement"][]>([]);
  const patch = useMemo(() => currentAthlete?.patches.find((p) => p.id === selectedId) ?? currentAthlete?.patches[0], [currentAthlete, selectedId]);
  const photo = currentAthlete?.photos.find((p) => p.id === patch?.photoId) ?? currentAthlete?.photos[0];
  if (!currentAthlete) return null;
  function addDefault(zone: PatchZone) {
    const def = DEFAULT_PATCHES.find((d) => d.zone === zone);
    const next: Patch = { id: uid("pt"), name: def?.name || ZONE_LABEL[zone], zone, price: def?.price || 1000, available: true, photoId: currentAthlete!.photos[0]?.id || "", placement: { x: 40, y: 30, width: 16, height: 9, rotation: 0 } };
    upsertPatch(next); setSelectedId(next.id);
  }
  function commit(next: Patch) {
    if (patch) { setHistory((h) => [...h, patch.placement]); setRedo([]); }
    upsertPatch(next);
  }
  return (
    <div className="page">
      <div className="kicker">Inventory</div>
      <h1 style={{ fontSize: 42 }}>Sponsorable zones</h1>
      <p className="muted">Keep it to a handful of honest placements. Drag the box, resize from the handle.</p>
      <div className="cta-row" style={{ margin: "16px 0" }}>
        {DEFAULT_PATCHES.map((d) => <button key={d.zone} className="btn btn-sm" onClick={() => addDefault(d.zone)}>+ {d.name}</button>)}
      </div>
      <div className="split">
        <div>
          {photo && patch ? <PatchCanvas photoUrl={photo.dataUrl} placement={patch.placement} editable onChange={(placement) => commit({ ...patch, placement })} /> : <div className="panel">Upload a photo first, then add a zone.</div>}
          {patch && (
            <div className="cta-row" style={{ marginTop: 12 }}>
              <button className="btn btn-sm" disabled={!history.length} onClick={() => { const prev = history[history.length - 1]; if (!prev || !patch) return; setHistory((h) => h.slice(0, -1)); setRedo((r) => [patch.placement, ...r]); upsertPatch({ ...patch, placement: prev }); }}>Undo</button>
              <button className="btn btn-sm" disabled={!redo.length} onClick={() => { const nxt = redo[0]; if (!nxt || !patch) return; setRedo((r) => r.slice(1)); setHistory((h) => [...h, patch.placement]); upsertPatch({ ...patch, placement: nxt }); }}>Redo</button>
              <label className="muted">Rotation<input type="range" min={-30} max={30} value={patch.placement.rotation} onChange={(e) => commit({ ...patch, placement: { ...patch.placement, rotation: Number(e.target.value) } })} /></label>
            </div>
          )}
        </div>
        <div className="panel">
          <h3>Zones</h3>
          {currentAthlete.patches.length === 0 && <p className="muted">No zones yet.</p>}
          {currentAthlete.patches.map((p) => (
            <button key={p.id} className="logo-tile" style={{ width: "100%", marginTop: 8, textAlign: "left" }} onClick={() => setSelectedId(p.id)}>
              <strong>{p.name}</strong>
              <div className="muted">{ZONE_LABEL[p.zone]} · {money(p.price)} · {p.available ? "open" : "locked"}</div>
            </button>
          ))}
          {patch && (
            <>
              <div className="field" style={{ marginTop: 16 }}><label>Name</label><input value={patch.name} onChange={(e) => upsertPatch({ ...patch, name: e.target.value })} /></div>
              <div className="field"><label>Price (EUR)</label><input type="number" value={patch.price} onChange={(e) => upsertPatch({ ...patch, price: Number(e.target.value) || 0 })} /></div>
              <div className="field"><label>Reference photo</label>
                <select value={patch.photoId} onChange={(e) => upsertPatch({ ...patch, photoId: e.target.value })}>
                  {currentAthlete.photos.map((ph) => <option key={ph.id} value={ph.id}>{ph.slot}</option>)}
                </select>
              </div>
              <div className="field"><label>Event / period</label><input value={patch.eventName || ""} onChange={(e) => upsertPatch({ ...patch, eventName: e.target.value })} /></div>
              <button className="btn btn-danger btn-sm" disabled={isPatchLocked(state, patch.id)} onClick={() => removePatch(patch.id)}>Delete zone</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
