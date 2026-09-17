import { Link, useParams } from "react-router-dom";
import { PatchCanvas } from "../../components/PatchCanvas";
import { StatusTag } from "../../components/ui";
import { formatDate, money } from "../../lib/id";
import { useStore } from "../../store/StoreContext";
import { ZONE_LABEL } from "../../types";

export function DealRoom() {
  const { id } = useParams();
  const { state, currentUser, transitionDeal } = useStore();
  const deal = state.deals.find((d) => d.id === id);
  if (!deal) return <div className="page"><h2>Deal not found</h2></div>;
  const snap = deal.snapshot;
  const isBrand = currentUser?.role === "brand";
  const isAthlete = currentUser?.role === "athlete";
  return (
    <div className="page">
      <Link to={isAthlete ? "/athlete/deals" : "/brand/deals"} className="muted">← Deal rooms</Link>
      <div className="kicker" style={{ marginTop: 8 }}>Deal dossier</div>
      <h1 style={{ fontSize: 40 }}>{snap.brandName} × {snap.athleteName}</h1>
      <p><StatusTag status={deal.status} /> {snap.campaignName}</p>
      <div className="split" style={{ marginTop: 18 }}>
        <PatchCanvas photoUrl={snap.photoUrl} logoUrl={snap.logoUrl} placement={snap.placement} />
        <div className="panel">
          <h3>Frozen snapshot</h3>
          <p className="muted">This placement and logo were copied at reservation time. Editing the live logo library will not change this deal.</p>
          <table className="table">
            <tbody>
              <tr><th>Zone</th><td>{ZONE_LABEL[snap.zone]} · {snap.patchName}</td></tr>
              <tr><th>Price</th><td>{money(snap.price)}</td></tr>
              <tr><th>Logo</th><td>{snap.logoName}</td></tr>
              <tr><th>Photo</th><td>{snap.photoSlot}</td></tr>
              <tr><th>Event</th><td>{snap.eventName || "—"}</td></tr>
              <tr><th>Reserved</th><td>{formatDate(deal.reservedAt)}</td></tr>
              <tr><th>Paid</th><td>{deal.paidAt ? formatDate(deal.paidAt) : "—"}</td></tr>
              <tr><th>Payment</th><td>{deal.paymentMode}</td></tr>
            </tbody>
          </table>
          <div style={{ marginTop: 12 }}><img src={snap.logoUrl} alt={snap.logoName} style={{ height: 48, objectFit: "contain" }} /></div>
          {isAthlete && deal.status === "RESERVED" && <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => transitionDeal(deal.id, "ACCEPTED")}>Accept deal</button>}
          {isBrand && deal.status === "ACCEPTED" && <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => transitionDeal(deal.id, "PAID")}>Mark DEMO paid</button>}
          {isBrand && deal.status === "PAID" && <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => transitionDeal(deal.id, "ACTIVE")}>Activate</button>}
          {isBrand && deal.status === "PROOF_SUBMITTED" && <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => transitionDeal(deal.id, "COMPLETED")}>Validate proof</button>}
          {deal.proof && (
            <div style={{ marginTop: 16 }}>
              <h3>Proof</h3>
              {deal.proof.dataUrl && <img src={deal.proof.dataUrl} alt="proof" style={{ borderRadius: 12 }} />}
              {deal.proof.url && <p>{deal.proof.url}</p>}
              {deal.proof.note && <p className="muted">{deal.proof.note}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
