import { Link } from "react-router-dom";
const shots = [
  "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=800&q=80",
];
export function Landing() {
  return (
    <div className="page page-wide">
      <section className="hero">
        <div>
          <div className="kicker">Photo-first sponsorship inventory</div>
          <h1>An athlete is a<br />physical medium.</h1>
          <p className="lead">Brands buy defined zones on real bodies and real kits — chest, shoulder, thigh, back — then lock a logo onto the athlete’s actual photo.</p>
          <div className="cta-row">
            <Link className="btn btn-primary" to="/auth?role=athlete&mode=register">I’m an Athlete</Link>
            <Link className="btn" to="/auth?role=brand&mode=register">I’m a Brand / Sponsor</Link>
            <Link className="btn btn-ghost" to="/auth">Sign in</Link>
          </div>
        </div>
        <div className="hero-mosaic">{shots.map((src) => <div key={src}><img src={src} alt="Athlete" /></div>)}</div>
      </section>
      <section className="grid-3" style={{ marginTop: 48 }}>
        <div className="panel"><div className="kicker">01</div><h3>Zone = inventory</h3><p className="muted">Five or six honest placements. Price, period, photo, locked coordinates.</p></div>
        <div className="panel"><div className="kicker">02</div><h3>Fit on the real photo</h3><p className="muted">Move, scale, rotate. What the brand sees is what the deal freezes.</p></div>
        <div className="panel"><div className="kicker">03</div><h3>Deal → pay → proof</h3><p className="muted">Reservation exclusivity, campaign budgets, proof after the race.</p></div>
      </section>
    </div>
  );
}
