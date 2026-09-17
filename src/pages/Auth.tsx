import { FormEvent, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Banner } from "../components/ui";
import { useStore } from "../store/StoreContext";
import type { Role } from "../types";

export function Auth() {
  const [params] = useSearchParams();
  const [role, setRole] = useState<Role>((params.get("role") as Role) || "athlete");
  const [mode, setMode] = useState<"login" | "register">(params.get("mode") === "register" ? "register" : "login");
  const [email, setEmail] = useState(role === "brand" ? "brand@form.demo" : "athlete@form.demo");
  const [password, setPassword] = useState("demo");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { login, register } = useStore();
  const nav = useNavigate();
  const hint = useMemo(() => role === "athlete" ? "Demo: athlete@form.demo, lea@form.demo / demo" : "Demo: brand@form.demo, pulse@form.demo / demo", [role]);
  function goHome(r: Role) { nav(r === "athlete" ? "/athlete" : "/brand/discover"); }
  function onSubmit(e: FormEvent) {
    e.preventDefault(); setError("");
    if (!email.trim() || !password) { setError("Email and password are required."); return; }
    if (mode === "login") {
      const res = login(email, password);
      if (!res.ok) setError(res.error || "Login failed"); else goHome(res.role || role);
      return;
    }
    const res = register({ email, password, role, name });
    if (!res.ok) setError(res.error || "Register failed"); else goHome(role);
  }
  return (
    <div className="page" style={{ maxWidth: 520 }}>
      <div className="kicker">{mode === "login" ? "Sign in" : "Create account"}</div>
      <h1 style={{ fontSize: 42 }}>{role === "athlete" ? "Athlete" : "Brand"}</h1>
      <p className="muted">{hint}</p>
      <div className="cta-row">
        <button className={`btn ${role === "athlete" ? "btn-primary" : ""}`} onClick={() => setRole("athlete")}>Athlete</button>
        <button className={`btn ${role === "brand" ? "btn-primary" : ""}`} onClick={() => setRole("brand")}>Brand</button>
        <button className="btn btn-ghost" onClick={() => setMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "Need an account" : "Have an account"}</button>
      </div>
      <form className="panel" style={{ marginTop: 20 }} onSubmit={onSubmit}>
        {error && <Banner kind="err">{error}</Banner>}
        {mode === "register" && <div className="field"><label>{role === "athlete" ? "Name" : "Company name"}</label><input value={name} onChange={(e) => setName(e.target.value)} /></div>}
        <div className="field"><label>Email</label><input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></div>
        <div className="field"><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></div>
        <button className="btn btn-primary" type="submit">{mode === "login" ? "Sign in" : "Create account"}</button>
      </form>
    </div>
  );
}
