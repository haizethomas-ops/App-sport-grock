import { Link } from "react-router-dom";
import { StatusTag } from "../../components/ui";
import { money } from "../../lib/id";
import { useStore } from "../../store/StoreContext";

export function Portfolio() {
  const { state, currentUser } = useStore();
  const deals = state.deals.filter((d) => d.brandId === currentUser?.id);
  return (
    <div className="page page-wide">
      <div className="kicker">Collaborations</div>
      <h1 style={{ fontSize: 42 }}>Portfolio</h1>
      <p className="muted">Every tile opens the deal room.</p>
      <div className="grid-cards" style={{ marginTop: 18 }}>
        {deals.map((d) => (
          <Link className="card" key={d.id} to={`/brand/deals/${d.id}`}>
            <div className="card-photo"><img src={d.snapshot.photoUrl} alt="" /></div>
            <div className="card-body">
              <StatusTag status={d.status} />
              <h3 style={{ marginTop: 8 }}>{d.snapshot.athleteName}</h3>
              <p className="muted">{d.snapshot.patchName} · {d.snapshot.campaignName} · {money(d.snapshot.price)}</p>
            </div>
          </Link>
        ))}
      </div>
      {deals.length === 0 && <p className="muted">No collaborations yet. Start from Discover.</p>}
    </div>
  );
}
