import { useStore } from "../store/StoreContext";

export function DemoBar() {
  const { state, impersonate, resetDemo, currentUser, sync } = useStore();
  const athletes = state.users.filter((u) => u.role === "athlete");
  const brands = state.users.filter((u) => u.role === "brand");
  return (
    <div className="panel" style={{ margin: "16px auto", width: "min(1180px, calc(100% - 32px))" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div className="kicker">Demo mode</div>
          <strong>Switch accounts without losing shared data.</strong>
          <div className={`sync-dot ${sync}`}>{sync === "saving" ? "Saving…" : sync === "failed" ? "Save failed" : "Synced locally"}</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={resetDemo}>Reset demo data</button>
      </div>
      <div className="demo-switch" style={{ marginTop: 12 }}>
        <span className="dim">Athletes</span>
        {athletes.map((u) => (
          <button key={u.id} className="chip" style={currentUser?.id === u.id ? { borderColor: "#e8ff3d", color: "#e8ff3d" } : undefined} onClick={() => impersonate(u.id)}>{u.email}</button>
        ))}
      </div>
      <div className="demo-switch" style={{ marginTop: 8 }}>
        <span className="dim">Brands</span>
        {brands.map((u) => (
          <button key={u.id} className="chip" style={currentUser?.id === u.id ? { borderColor: "#e8ff3d", color: "#e8ff3d" } : undefined} onClick={() => impersonate(u.id)}>{u.email}</button>
        ))}
      </div>
    </div>
  );
}
