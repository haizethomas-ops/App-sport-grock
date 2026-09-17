import { Link } from "react-router-dom";
import { StatusTag } from "../../components/ui";
import { money } from "../../lib/id";
import { useStore } from "../../store/StoreContext";

export function DealRooms() {
  const { state, currentUser } = useStore();
  const deals = currentUser?.role === "brand"
    ? state.deals.filter((d) => d.brandId === currentUser.id)
    : state.deals.filter((d) => d.athleteId === currentUser?.id);
  return (
    <div className="page">
      <div className="kicker">Dossiers</div>
      <h1 style={{ fontSize: 42 }}>Deal Rooms</h1>
      {deals.map((d) => (
        <Link key={d.id} className="panel" to={`/brand/deals/${d.id}`} style={{ display: "block", marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <StatusTag status={d.status} />
              <h3 style={{ marginTop: 8 }}>{d.snapshot.brandName} × {d.snapshot.athleteName}</h3>
              <p className="muted">{d.snapshot.patchName} · {d.snapshot.campaignName} · {money(d.snapshot.price)}</p>
            </div>
            <span className="btn btn-sm">Open</span>
          </div>
        </Link>
      ))}
      {deals.length === 0 && <p className="muted">No deal rooms yet.</p>}
    </div>
  );
}
