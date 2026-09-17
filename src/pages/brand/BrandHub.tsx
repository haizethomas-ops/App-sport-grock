import { useStore } from "../../store/StoreContext";
import { svgLogo } from "../../seed/logos";

export function BrandHub() {
  const { currentBrand, currentUser, updateBrand, state, addLogo, updateLogo } = useStore();
  if (!currentBrand || !currentUser) return null;
  const logos = state.logos.filter((l) => l.brandId === currentUser.id);
  function onFile(file: File | undefined) {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => addLogo({ name: file.name.replace(/\.[^.]+$/, ""), dataUrl: String(r.result || ""), version: "v1", tags: ["upload"], background: "dark", active: true });
    r.readAsDataURL(file);
  }
  return (
    <div className="page">
      <div className="kicker">Company</div>
      <h1 style={{ fontSize: 42 }}>Brand Hub</h1>
      <p className="muted">Changing the name here updates it everywhere this session — including navigation.</p>
      <div className="split" style={{ marginTop: 18 }}>
        <div className="panel">
          <h3>Profile</h3>
          <div className="field"><label>Brand name</label><input value={currentBrand.name} onChange={(e) => updateBrand({ name: e.target.value })} /></div>
          <div className="field"><label>Legal name</label><input value={currentBrand.legalName} onChange={(e) => updateBrand({ legalName: e.target.value })} /></div>
          <div className="field"><label>Sector</label><input value={currentBrand.sector} onChange={(e) => updateBrand({ sector: e.target.value })} /></div>
          <div className="field"><label>Country</label><input value={currentBrand.country} onChange={(e) => updateBrand({ country: e.target.value })} /></div>
          <div className="field"><label>Website</label><input value={currentBrand.website} onChange={(e) => updateBrand({ website: e.target.value })} /></div>
          <div className="field"><label>Description</label><textarea value={currentBrand.description} onChange={(e) => updateBrand({ description: e.target.value })} /></div>
        </div>
        <div className="panel">
          <h3>Team</h3>
          {currentBrand.members.map((m) => <div key={m.id} style={{ marginBottom: 10 }}><strong>{m.name}</strong><div className="muted">{m.role} · {m.email}</div></div>)}
          {currentBrand.members.length === 0 && <p className="muted">No members listed.</p>}
          <h3 style={{ marginTop: 18 }}>Billing (DEMO)</h3>
          <p className="muted">Live Stripe Connect is not enabled. Demo payments record status only. Never commit secret keys.</p>
        </div>
      </div>
      <div className="panel" style={{ marginTop: 18 }}>
        <h3>Logo library</h3>
        <p className="muted">Primary, light, dark, campaign variants. Deals keep a frozen copy.</p>
        <div className="logo-grid">
          {logos.map((l) => (
            <div key={l.id} className="logo-tile">
              <img src={l.dataUrl} alt={l.name} />
              <input value={l.name} onChange={(e) => updateLogo(l.id, { name: e.target.value })} style={{ width: "100%", background: "transparent", border: 0, marginTop: 6 }} />
              <button className="btn btn-sm" onClick={() => updateLogo(l.id, { dataUrl: svgLogo({ text: l.name.slice(0, 8).toUpperCase() || "LOGO", bg: "#222", fg: "#E8FF3D", sub: "UPDATED" }), version: `${l.version}+edit` })}>Replace (test immutability)</button>
            </div>
          ))}
        </div>
        <div className="field" style={{ marginTop: 16 }}><label>Upload logo</label><input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} /></div>
      </div>
    </div>
  );
}
