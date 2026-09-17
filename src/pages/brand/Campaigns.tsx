import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../store/StoreContext";
import { campaignSpend } from "../../lib/deals";
import { money } from "../../lib/id";

export function Campaigns() {
  const { state, currentUser, createCampaign } = useStore();
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [budget, setBudget] = useState(10000);
  const campaigns = state.campaigns.filter((c) => c.brandId === currentUser?.id);
  function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createCampaign({ name: name.trim(), objective, budget: Number(budget) || 0, startDate: new Date().toISOString().slice(0, 10), endDate: "", status: "active" });
    setName(""); setObjective("");
  }
  return (
    <div className="page">
      <div className="kicker">Planning</div>
      <h1 style={{ fontSize: 42 }}>Campaigns</h1>
      <p className="muted">Create as many as you need. Creating B never deletes A.</p>
      <form className="panel" onSubmit={onCreate} style={{ margin: "18px 0" }}>
        <div className="grid-2">
          <div className="field"><label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Summer Campaign" /></div>
          <div className="field"><label>Budget (EUR)</label><input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} /></div>
        </div>
        <div className="field"><label>Objective</label><input value={objective} onChange={(e) => setObjective(e.target.value)} /></div>
        <button className="btn btn-primary" type="submit">Create campaign</button>
      </form>
      <div className="grid-cards">
        {campaigns.map((c) => {
          const roll = campaignSpend(state, c.id);
          return (
            <Link className="card" key={c.id} to={`/brand/campaigns/${c.id}`}>
              <div className="card-body">
                <div className="tag">{c.status}</div>
                <h3 style={{ marginTop: 8 }}>{c.name}</h3>
                <p className="muted">{c.objective || "No objective set"}</p>
                <p>Budget {money(c.budget)} · reserved {money(roll.reserved)} · paid {money(roll.paid)}</p>
                <p className="muted">{roll.count} deals</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
