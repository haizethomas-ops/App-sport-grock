import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../store/StoreContext";
import { formatAudience, money } from "../../lib/id";

export function Discover() {
  const { state } = useStore();
  const [sport, setSport] = useState("all");
  const athletes = useMemo(() => state.athletes.filter((a) => a.published && a.name && (sport === "all" || a.sport === sport)), [state.athletes, sport]);
  const sports = Array.from(new Set(state.athletes.filter((a) => a.published).map((a) => a.sport))).filter(Boolean);
  return (
    <div className="page page-wide">
      <div className="kicker">Marketplace</div>
      <h1 style={{ fontSize: 48 }}>Roster</h1>
      <p className="muted">Large photos. Real inventory. Not a spreadsheet.</p>
      <div className="cta-row">
        <button className={`btn btn-sm ${sport === "all" ? "btn-primary" : ""}`} onClick={() => setSport("all")}>All sports</button>
        {sports.map((s) => <button key={s} className={`btn btn-sm ${sport === s ? "btn-primary" : ""}`} onClick={() => setSport(s)}>{s}</button>)}
      </div>
      <div className="grid-cards" style={{ marginTop: 20 }}>
        {athletes.map((a) => {
          const cover = a.photos[0]?.dataUrl || a.avatarUrl;
          const prices = a.patches.map((p) => p.price);
          const from = prices.length ? Math.min(...prices) : 0;
          const open = a.patches.filter((p) => p.available).length;
          return (
            <Link className="card" key={a.userId} to={`/brand/athlete/${a.userId}`}>
              <div className="card-photo">{cover && <img src={cover} alt={a.name} />}</div>
              <div className="card-body">
                <div className="tag">{a.sport}</div>
                <h3 style={{ marginTop: 8 }}>{a.name}</h3>
                <p className="muted">{a.location} · {formatAudience(a.audience)} · {open} open{from ? ` · from ${money(from)}` : ""}</p>
              </div>
            </Link>
          );
        })}
      </div>
      {athletes.length === 0 && <p className="muted">No published athletes match this filter.</p>}
    </div>
  );
}
