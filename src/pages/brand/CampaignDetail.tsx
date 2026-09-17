import { Link, useParams } from "react-router-dom";
import { StatusTag } from "../../components/ui";
import { campaignSpend } from "../../lib/deals";
import { money } from "../../lib/id";
import { useStore } from "../../store/StoreContext";

export function CampaignDetail() {
  const { id } = useParams();
  const { state, updateCampaign } = useStore();
  const campaign = state.campaigns.find((c) => c.id === id);
  if (!campaign) return <div className="page">Unknown campaign.</div>;
  const deals = state.deals.filter((d) => d.campaignId === campaign.id);
  const roll = campaignSpend(state, campaign.id);
  return (
    <div className="page">
      <Link to="/brand/campaigns" className="muted">← Campaigns</Link>
      <h1 style={{ fontSize: 42, marginTop: 8 }}>{campaign.name}</h1>
      <div className="stat-row" style={{ margin: "18px 0" }}>
        <div className="stat"><b>{money(campaign.budget)}</b><span>Total</span></div>
        <div className="stat"><b>{money(roll.reserved)}</b><span>Reserved</span></div>
        <div className="stat"><b>{money(roll.paid)}</b><span>Paid</span></div>
        <div className="stat"><b>{money(Math.max(0, campaign.budget - roll.reserved - roll.paid))}</b><span>Remaining</span></div>
      </div>
      <div className="panel">
        <div className="field"><label>Objective</label><input value={campaign.objective} onChange={(e) => updateCampaign(campaign.id, { objective: e.target.value })} /></div>
        <div className="field"><label>Budget</label><input type="number" value={campaign.budget} onChange={(e) => updateCampaign(campaign.id, { budget: Number(e.target.value) || 0 })} /></div>
      </div>
      <h3 style={{ margin: "22px 0 10px" }}>Deals in this campaign</h3>
      {deals.map((d) => (
        <Link key={d.id} className="panel" to={`/brand/deals/${d.id}`} style={{ display: "block", marginBottom: 10 }}>
          <StatusTag status={d.status} /> {d.snapshot.athleteName} · {d.snapshot.patchName} · {money(d.snapshot.price)}
        </Link>
      ))}
      {deals.length === 0 && <p className="muted">No deals yet.</p>}
    </div>
  );
}
