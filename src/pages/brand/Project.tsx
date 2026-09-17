import { Link } from "react-router-dom";
import { brandBudgetRollup, campaignSpend } from "../../lib/deals";
import { money } from "../../lib/id";
import { useStore } from "../../store/StoreContext";
import { StatusTag } from "../../components/ui";

export function Project() {
  const { state, currentUser, currentBrand } = useStore();
  if (!currentUser) return null;
  const roll = brandBudgetRollup(state, currentUser.id);
  const campaigns = state.campaigns.filter((c) => c.brandId === currentUser.id);
  const deals = state.deals.filter((d) => d.brandId === currentUser.id);
  const waiting = deals.filter((d) => ["RESERVED", "PROOF_SUBMITTED"].includes(d.status));
  return (
    <div className="page">
      <div className="kicker">Your project</div>
      <h1 style={{ fontSize: 42 }}>{currentBrand?.name || "Brand"} overview</h1>
      <div className="stat-row" style={{ margin: "20px 0" }}>
        <div className="stat"><b>{money(roll.total)}</b><span>Campaign budgets</span></div>
        <div className="stat"><b>{money(roll.reserved)}</b><span>Reserved</span></div>
        <div className="stat"><b>{money(roll.paid)}</b><span>Paid / active</span></div>
        <div className="stat"><b>{money(roll.remaining)}</b><span>Remaining</span></div>
      </div>
      <div className="split">
        <div className="panel">
          <h3>Campaign mix</h3>
          {campaigns.map((c) => {
            const s = campaignSpend(state, c.id);
            return (
              <div key={c.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                <Link to={`/brand/campaigns/${c.id}`}><strong>{c.name}</strong></Link>
                <div className="muted">{money(s.paid)} paid · {money(s.reserved)} reserved · {s.count} deals</div>
              </div>
            );
          })}
          {campaigns.length === 0 && <p className="muted">Create a campaign to start allocating budget.</p>}
        </div>
        <div className="panel">
          <h3>Needs action</h3>
          {waiting.length === 0 && <p className="muted">Nothing waiting.</p>}
          {waiting.map((d) => <Link key={d.id} to={`/brand/deals/${d.id}`} style={{ display: "block", marginTop: 8 }}><StatusTag status={d.status} /> {d.snapshot.athleteName}</Link>)}
        </div>
      </div>
    </div>
  );
}
