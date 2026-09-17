import { useState } from "react";
import { Link } from "react-router-dom";
import { StatusTag } from "../../components/ui";
import { useStore } from "../../store/StoreContext";
import { money } from "../../lib/id";

export function AthleteDeals() {
  const { currentUser, state, transitionDeal, submitProof } = useStore();
  const [note, setNote] = useState("");
  const [file, setFile] = useState("");
  if (!currentUser) return null;
  const deals = state.deals.filter((d) => d.athleteId === currentUser.id);
  return (
    <div className="page">
      <div className="kicker">Incoming</div>
      <h1 style={{ fontSize: 42 }}>Deals</h1>
      {deals.length === 0 && <p className="muted">No reservations yet. Publish and wait for a brand.</p>}
      <div className="grid-cards" style={{ marginTop: 18 }}>
        {deals.map((d) => (
          <div className="card" key={d.id}>
            <div className="card-photo"><img src={d.snapshot.photoUrl} alt="" /></div>
            <div className="card-body">
              <StatusTag status={d.status} />
              <h3 style={{ marginTop: 8 }}>{d.snapshot.brandName}</h3>
              <p className="muted">{d.snapshot.patchName} · {money(d.snapshot.price)} · {d.snapshot.campaignName}</p>
              {d.status === "RESERVED" && <button className="btn btn-primary btn-sm" onClick={() => transitionDeal(d.id, "ACCEPTED")}>Accept</button>}
              {d.status === "ACTIVE" && (
                <div>
                  <div className="field"><label>Proof note</label><input value={note} onChange={(e) => setNote(e.target.value)} /></div>
                  <div className="field"><label>Proof photo</label><input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => setFile(String(r.result || "")); r.readAsDataURL(f); }} /></div>
                  <button className="btn btn-primary btn-sm" onClick={() => submitProof(d.id, { kind: file ? "photo" : "link", dataUrl: file || undefined, url: note.startsWith("http") ? note : undefined, note })}>Submit proof</button>
                </div>
              )}
              <Link className="btn btn-ghost btn-sm" to={`/athlete/deals/${d.id}`} style={{ marginTop: 8 }}>Open dossier</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
