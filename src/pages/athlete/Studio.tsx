import { Link } from "react-router-dom";
import { useStore } from "../../store/StoreContext";
import { money } from "../../lib/id";

export function AthleteStudio() {
  const { currentAthlete, currentUser, state, updateAthlete, publishAthlete } = useStore();
  if (!currentAthlete || !currentUser) return null;
  const deals = state.deals.filter((d) => d.athleteId === currentUser.id);
  const potential = currentAthlete.patches.reduce((s, p) => s + p.price, 0);
  const earned = deals.filter((d) => ["PAID", "ACTIVE", "PROOF_SUBMITTED", "COMPLETED"].includes(d.status)).reduce((s, d) => s + d.snapshot.price, 0);
  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    updateAthlete({ [e.target.name]: e.target.value } as never);
  }
  const ready = !!currentAthlete.name && !!currentAthlete.sport && currentAthlete.photos.length > 0 && currentAthlete.patches.length > 0;
  return (
    <div className="page">
      <div className="kicker">Athlete studio</div>
      <h1 style={{ fontSize: 48 }}>{currentAthlete.name || "Your profile"}</h1>
      <p className="muted">Visual, fast, publishable. Brands only see you once you publish.</p>
      <div className="stat-row" style={{ margin: "22px 0" }}>
        <div className="stat"><b>{currentAthlete.photos.length}</b><span>Photos</span></div>
        <div className="stat"><b>{currentAthlete.patches.filter((p) => p.available).length}</b><span>Open slots</span></div>
        <div className="stat"><b>{money(potential)}</b><span>Inventory value</span></div>
        <div className="stat"><b>{money(earned)}</b><span>Paid / active</span></div>
      </div>
      <div className="split">
        <div className="panel">
          <h3>Identity</h3>
          <div className="grid-2" style={{ marginTop: 12 }}>
            <div className="field"><label>Name</label><input name="name" value={currentAthlete.name} onChange={onChange} /></div>
            <div className="field"><label>Sport</label><input name="sport" value={currentAthlete.sport} onChange={onChange} /></div>
            <div className="field"><label>Discipline</label><input name="discipline" value={currentAthlete.discipline} onChange={onChange} /></div>
            <div className="field"><label>Location</label><input name="location" value={currentAthlete.location} onChange={onChange} /></div>
            <div className="field"><label>Level</label><select name="level" value={currentAthlete.level} onChange={onChange}><option>Amateur</option><option>Amateur+</option><option>Semi-pro</option><option>Pro</option><option>Elite</option></select></div>
            <div className="field"><label>Audience</label><input type="number" value={currentAthlete.audience} onChange={(e) => updateAthlete({ audience: Number(e.target.value) || 0 })} /></div>
          </div>
          <div className="field"><label>Bio</label><textarea name="bio" value={currentAthlete.bio} onChange={onChange} /></div>
          <div className="grid-2">
            <div className="field"><label>Instagram</label><input value={currentAthlete.socials.instagram || ""} onChange={(e) => updateAthlete({ socials: { ...currentAthlete.socials, instagram: e.target.value } })} /></div>
            <div className="field"><label>Strava</label><input value={currentAthlete.socials.strava || ""} onChange={(e) => updateAthlete({ socials: { ...currentAthlete.socials, strava: e.target.value } })} /></div>
          </div>
        </div>
        <div className="panel">
          <h3>Publish</h3>
          <p className="muted">{ready ? "Profile is complete enough to appear in Discover." : "Add a name, sport, at least one photo and one patch before publishing."}</p>
          <div className="cta-row">
            <button className="btn btn-primary" disabled={!ready && !currentAthlete.published} onClick={() => publishAthlete(!currentAthlete.published)}>{currentAthlete.published ? "Unpublish" : "Publish profile"}</button>
            <Link className="btn" to="/athlete/photos">Photos</Link>
            <Link className="btn" to="/athlete/inventory">Inventory</Link>
          </div>
          <p className="muted" style={{ marginTop: 16 }}>Status: {currentAthlete.published ? "Live in marketplace" : "Draft"}</p>
        </div>
      </div>
    </div>
  );
}
