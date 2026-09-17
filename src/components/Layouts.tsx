import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useStore } from "../store/StoreContext";
import { DemoBar } from "./DemoBar";
import { Logo } from "./ui";

export function PublicLayout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Logo />
        <nav className="nav-links">
          <NavLink to="/auth?role=athlete">I’m an Athlete</NavLink>
          <NavLink to="/auth?role=brand">I’m a Brand</NavLink>
        </nav>
        <div style={{ display: "flex", gap: 8 }}>
          <NavLink to="/auth" className="btn btn-ghost btn-sm">Sign in</NavLink>
          <NavLink to="/auth?mode=register" className="btn btn-primary btn-sm">Register</NavLink>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

export function AthleteLayout() {
  const { logout } = useStore();
  const nav = useNavigate();
  return (
    <div className="app-shell">
      <header className="topbar">
        <Logo />
        <nav className="nav-links">
          <NavLink to="/athlete">Studio</NavLink>
          <NavLink to="/athlete/photos">Photos</NavLink>
          <NavLink to="/athlete/inventory">Inventory</NavLink>
          <NavLink to="/athlete/deals">Deals</NavLink>
        </nav>
        <button className="btn btn-ghost btn-sm" onClick={() => { logout(); nav("/"); }}>Sign out</button>
      </header>
      <DemoBar />
      <Outlet />
      <nav className="mobile-nav">
        <NavLink to="/athlete">Studio</NavLink>
        <NavLink to="/athlete/photos">Photos</NavLink>
        <NavLink to="/athlete/inventory">Inventory</NavLink>
        <NavLink to="/athlete/deals">Deals</NavLink>
      </nav>
    </div>
  );
}

export function BrandLayout() {
  const { currentBrand, logout } = useStore();
  const nav = useNavigate();
  return (
    <div className="app-shell">
      <header className="brand-topbar">
        <Logo />
        <nav className="nav-links">
          <NavLink to="/brand/discover">Discover</NavLink>
          <NavLink to="/brand/campaigns">Campaigns</NavLink>
          <NavLink to="/brand/project">Project</NavLink>
          <NavLink to="/brand/portfolio">Portfolio</NavLink>
          <NavLink to="/brand/deals">Deal Rooms</NavLink>
          <NavLink to="/brand/events">Events</NavLink>
          <NavLink to="/brand/hub">Brand Hub</NavLink>
        </nav>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="muted">{currentBrand?.name || "Brand"}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => { logout(); nav("/"); }}>Sign out</button>
        </div>
      </header>
      <DemoBar />
      <Outlet />
      <nav className="mobile-nav">
        <NavLink to="/brand/discover">Discover</NavLink>
        <NavLink to="/brand/campaigns">Campaigns</NavLink>
        <NavLink to="/brand/portfolio">Portfolio</NavLink>
        <NavLink to="/brand/deals">Deals</NavLink>
        <NavLink to="/brand/hub">Hub</NavLink>
      </nav>
    </div>
  );
}
