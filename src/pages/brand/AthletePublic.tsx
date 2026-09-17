import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PatchCanvas } from "../../components/PatchCanvas";
import { Banner } from "../../components/ui";
import { useStore } from "../../store/StoreContext";
import { formatAudience, money } from "../../lib/id";
import type { Placement } from "../../types";
import { ZONE_LABEL } from "../../types";

const STEPS = ["Patch", "Logo", "Fit", "Review", "Pay"];

export function AthletePublic() {
  const { id } = useParams();
  const { state, currentBrand, currentUser, reserveDeal } = useStore();
  const nav = useNavigate();
  const athlete = state.athletes.find((a) => a.userId === id && a.published);
  const campaigns = state.campaigns.filter((c) => c.brandId === currentUser?.id);
  const logos = state.logos.filter((l) => l.brandId === currentUser?.id && l.active);
  const [step, setStep] = useState(0);
  const [patchId, setPatchId] = useState("");
  const [logoId, setLogoId] = useState(logos[0]?.id || "");
  const [campaignId, setCampaignId] = useState(campaigns[0]?.id || "");
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [error, setError] = useState("");
  const [undo, setUndo] = useState<Placement[]>([]);
  const patch = athlete?.patches.find((p) => p.id === patchId);
  const photo = athlete?.photos.find((p) => p.id === patch?.photoId) ?? athlete?.photos[0];
  const logo = logos.find((l) => l.id === logoId);
  const livePlacement = placement || patch?.placement;
  const cover = useMemo(() => athlete?.photos[0]?.dataUrl || athlete?.avatarUrl, [athlete]);
  if (!athlete) return <div className="page"><h2>Athlete not found</h2><p className="muted">They may be unpublished.</p></div>;

  function startPatch(pid: string) {
    const p = athlete!.patches.find((x) => x.id === pid);
    if (!p || !p.available) return;
    setPatchId(pid); setPlacement(p.placement); setStep(1); setError("");
  }
  function pay() {
    setError("");
    if (!currentBrand) { setError("Complete Brand Hub first."); return; }
    if (!patch || !livePlacement) return;
    const res = reserveDeal({ athleteId: athlete.userId, patchId: patch.id, campaignId, logoId, placement: livePlacement, autoActivate: true });
    if (!res.ok || !res.deal) { setError(res.error || "Reservation failed"); return; }
    nav(`/brand/deals/${res.deal.id}`);
  }

  return (
    <div className="page page-wide">
      <div className="split">
        <div>
          {photo && livePlacement && patch ? (
            <PatchCanvas photoUrl={photo.dataUrl} logoUrl={step >= 2 ? logo?.dataUrl : undefined} placement={livePlacement} editable={step === 2} onChange={(next) => { if (livePlacement) setUndo((u) => [...u, livePlacement]); setPlacement(next); }} />
          ) : cover ? <div className="photo-canvas"><img className="base" src={cover} alt={athlete.name} /></div> : null}
        </div>
        <div>
          <div className="kicker">{athlete.sport} · {athlete.level}</div>
          <h1 style={{ fontSize: 42 }}>{athlete.name}</h1>
          <p className="muted">{athlete.location} · {formatAudience(athlete.audience)} audience</p>
          <p>{athlete.bio}</p>
          <div className="cta-row">
            {athlete.socials.instagram && <span className="tag">{athlete.socials.instagram}</span>}
            {athlete.socials.strava && <span className="tag">{athlete.socials.strava}</span>}
          </div>
          <div className="steps" style={{ marginTop: 18 }}>{STEPS.map((s, i) => <div key={s} className={`step ${i === step ? "on" : ""}`}>{i + 1}. {s}</div>)}</div>
          {error && <Banner kind="err">{error}</Banner>}
          {step === 0 && (
            <div className="panel">
              <h3>Select a zone</h3>
              {athlete.patches.map((p) => (
                <button key={p.id} className="logo-tile" style={{ width: "100%", marginTop: 8, textAlign: "left", opacity: p.available ? 1 : 0.45 }} disabled={!p.available} onClick={() => startPatch(p.id)}>
                  <strong>{p.name}</strong>
                  <div className="muted">{ZONE_LABEL[p.zone]} · {money(p.price)} · {p.available ? "available" : "locked"}</div>
                </button>
              ))}
            </div>
          )}
          {step === 1 && (
            <div className="panel">
              <h3>Logo library</h3>
              <div className="logo-grid">
                {logos.map((l) => (
                  <button key={l.id} className={`logo-tile ${l.id === logoId ? "selected" : ""}`} onClick={() => setLogoId(l.id)}>
                    <img src={l.dataUrl} alt={l.name} /><div className="muted">{l.name}</div>
                  </button>
                ))}
              </div>
              {logos.length === 0 && <p className="muted">Upload logos in Brand Hub first.</p>}
              <div className="cta-row" style={{ marginTop: 12 }}>
                <button className="btn" onClick={() => setStep(0)}>Back</button>
                <button className="btn btn-primary" disabled={!logoId} onClick={() => setStep(2)}>Fit on photo</button>
              </div>
            </div>
          )}
          {step === 2 && patch && (
            <div className="panel">
              <h3>Fit</h3>
              <p className="muted">Drag the logo. Use the yellow handle to scale. Proportions stay locked.</p>
              <label className="muted">Rotation<input type="range" min={-30} max={30} value={livePlacement?.rotation || 0} onChange={(e) => setPlacement({ ...(livePlacement || patch.placement), rotation: Number(e.target.value) })} /></label>
              <div className="cta-row">
                <button className="btn btn-sm" disabled={!undo.length} onClick={() => { const prev = undo[undo.length - 1]; if (!prev) return; setUndo((u) => u.slice(0, -1)); setPlacement(prev); }}>Undo</button>
                <button className="btn" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-primary" onClick={() => setStep(3)}>Review</button>
              </div>
            </div>
          )}
          {step === 3 && patch && (
            <div className="panel">
              <h3>Review</h3>
              <p>{athlete.name} · {patch.name} · {money(patch.price)}</p>
              <div className="field"><label>Campaign</label>
                <select value={campaignId} onChange={(e) => setCampaignId(e.target.value)}>
                  {campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              {campaigns.length === 0 && <p className="muted">Create a campaign first.</p>}
              <div className="cta-row">
                <button className="btn" onClick={() => setStep(2)}>Back</button>
                <button className="btn btn-primary" disabled={!campaignId} onClick={() => setStep(4)}>Reserve / Pay</button>
              </div>
            </div>
          )}
          {step === 4 && patch && (
            <div className="panel">
              <h3>DEMO payment</h3>
              <p className="muted">Stripe Checkout is prepared in architecture but not live. This records a DEMO payment and freezes the snapshot.</p>
              <p>Charge {money(patch.price)} to campaign {campaigns.find((c) => c.id === campaignId)?.name}</p>
              <div className="cta-row">
                <button className="btn" onClick={() => setStep(3)}>Back</button>
                <button className="btn btn-primary" onClick={pay}>Confirm DEMO payment</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
