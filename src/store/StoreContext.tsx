import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AppState, AthleteProfile, BrandLogo, BrandProfile, Campaign, Deal, DealSnapshot, DealStatus, Patch, Photo, PhotoSlot, Placement, Proof, Role, User } from "../types";
import { canTransition, isPatchLocked } from "../lib/deals";
import { nowIso, uid } from "../lib/id";
import { loadState, resetState, saveState } from "../lib/storage";

export type SyncStatus = "idle" | "saving" | "synced" | "failed";

type StoreApi = {
  state: AppState;
  sync: SyncStatus;
  currentUser: User | null;
  currentAthlete: AthleteProfile | null;
  currentBrand: BrandProfile | null;
  register: (input: { email: string; password: string; role: Role; name?: string }) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string; role?: Role };
  logout: () => void;
  impersonate: (userId: string) => void;
  updateAthlete: (patch: Partial<AthleteProfile>) => void;
  upsertPhoto: (slot: PhotoSlot, dataUrl: string) => void;
  removePhoto: (photoId: string) => void;
  upsertPatch: (patch: Patch) => void;
  removePatch: (patchId: string) => void;
  publishAthlete: (published: boolean) => void;
  updateBrand: (patch: Partial<BrandProfile>) => void;
  addLogo: (logo: Omit<BrandLogo, "id" | "brandId" | "createdAt">) => void;
  updateLogo: (id: string, patch: Partial<BrandLogo>) => void;
  removeLogo: (id: string) => void;
  createCampaign: (input: Omit<Campaign, "id" | "brandId" | "createdAt">) => Campaign | null;
  updateCampaign: (id: string, patch: Partial<Campaign>) => void;
  reserveDeal: (input: { athleteId: string; patchId: string; campaignId: string; logoId: string; placement: Placement; autoActivate?: boolean }) => { ok: boolean; deal?: Deal; error?: string };
  transitionDeal: (dealId: string, to: DealStatus) => { ok: boolean; error?: string };
  submitProof: (dealId: string, proof: Omit<Proof, "submittedAt">) => { ok: boolean; error?: string };
  resetDemo: () => void;
};

const Ctx = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());
  const [sync, setSync] = useState<SyncStatus>("synced");

  useEffect(() => {
    setSync("saving");
    try {
      saveState(state);
      const t = window.setTimeout(() => setSync("synced"), 250);
      return () => window.clearTimeout(t);
    } catch {
      setSync("failed");
    }
  }, [state]);

  const mutate = useCallback((fn: (s: AppState) => AppState) => setState((prev) => fn(prev)), []);
  const currentUser = useMemo(() => state.users.find((u) => u.id === state.sessionUserId) ?? null, [state.users, state.sessionUserId]);
  const currentAthlete = useMemo(() => (currentUser?.role === "athlete" ? state.athletes.find((a) => a.userId === currentUser.id) ?? null : null), [currentUser, state.athletes]);
  const currentBrand = useMemo(() => (currentUser?.role === "brand" ? state.brands.find((b) => b.userId === currentUser.id) ?? null : null), [currentUser, state.brands]);

  const api = useMemo<StoreApi>(() => ({
    state, sync, currentUser, currentAthlete, currentBrand,
    register: ({ email, password, role, name }) => {
      if (state.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) return { ok: false, error: "An account already uses this email." };
      const id = uid(role === "athlete" ? "ath" : "br");
      const user: User = { id, email: email.trim(), password, role, createdAt: nowIso() };
      mutate((s) => ({
        ...s, users: [...s.users, user], sessionUserId: id,
        athletes: role === "athlete" ? [...s.athletes, { userId: id, name: name?.trim() || "", sport: "", discipline: "", location: "", country: "", level: "Amateur", gender: "other", bio: "", avatarUrl: "", audience: 0, stats: [], socials: {}, events: [], photos: [], patches: [], published: false }] : s.athletes,
        brands: role === "brand" ? [...s.brands, { userId: id, name: name?.trim() || "Untitled brand", logoUrl: "", description: "", website: "", sector: "", country: "", legalName: "", members: [] }] : s.brands,
      }));
      return { ok: true };
    },
    login: (email, password) => {
      const user = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!user) return { ok: false, error: "Unknown email or password." };
      mutate((s) => ({ ...s, sessionUserId: user.id }));
      return { ok: true, role: user.role };
    },
    logout: () => mutate((s) => ({ ...s, sessionUserId: null })),
    impersonate: (userId) => mutate((s) => ({ ...s, sessionUserId: userId })),
    updateAthlete: (patch) => {
      if (!currentUser || currentUser.role !== "athlete") return;
      mutate((s) => ({ ...s, athletes: s.athletes.map((a) => (a.userId === currentUser.id ? { ...a, ...patch } : a)) }));
    },
    upsertPhoto: (slot, dataUrl) => {
      if (!currentUser || currentUser.role !== "athlete") return;
      mutate((s) => ({
        ...s,
        athletes: s.athletes.map((a) => {
          if (a.userId !== currentUser.id) return a;
          const existing = a.photos.find((p) => p.slot === slot);
          const photo: Photo = existing ? { ...existing, dataUrl } : { id: uid("ph"), slot, dataUrl, createdAt: nowIso() };
          const photos = existing ? a.photos.map((p) => (p.slot === slot ? photo : p)) : [...a.photos, photo];
          return { ...a, photos, avatarUrl: slot === "front" || !a.avatarUrl ? dataUrl : a.avatarUrl };
        }),
      }));
    },
    removePhoto: (photoId) => {
      if (!currentUser || currentUser.role !== "athlete") return;
      mutate((s) => ({
        ...s,
        athletes: s.athletes.map((a) => {
          if (a.userId !== currentUser.id) return a;
          return { ...a, photos: a.photos.filter((p) => p.id !== photoId), patches: a.patches.map((pt) => (pt.photoId === photoId ? { ...pt, photoId: a.photos.find((p) => p.id !== photoId)?.id ?? "" } : pt)) };
        }),
      }));
    },
    upsertPatch: (patch) => {
      if (!currentUser || currentUser.role !== "athlete") return;
      mutate((s) => ({
        ...s,
        athletes: s.athletes.map((a) => {
          if (a.userId !== currentUser.id) return a;
          const exists = a.patches.some((p) => p.id === patch.id);
          return { ...a, patches: exists ? a.patches.map((p) => (p.id === patch.id ? patch : p)) : [...a.patches, patch] };
        }),
      }));
    },
    removePatch: (patchId) => {
      if (!currentUser || currentUser.role !== "athlete") return;
      if (isPatchLocked(state, patchId)) return;
      mutate((s) => ({ ...s, athletes: s.athletes.map((a) => (a.userId === currentUser.id ? { ...a, patches: a.patches.filter((p) => p.id !== patchId) } : a)) }));
    },
    publishAthlete: (published) => {
      if (!currentUser || currentUser.role !== "athlete") return;
      mutate((s) => ({ ...s, athletes: s.athletes.map((a) => (a.userId === currentUser.id ? { ...a, published } : a)) }));
    },
    updateBrand: (patch) => {
      if (!currentUser || currentUser.role !== "brand") return;
      mutate((s) => ({ ...s, brands: s.brands.map((b) => (b.userId === currentUser.id ? { ...b, ...patch } : b)) }));
    },
    addLogo: (logo) => {
      if (!currentUser || currentUser.role !== "brand") return;
      mutate((s) => ({ ...s, logos: [...s.logos, { ...logo, id: uid("lg"), brandId: currentUser.id, createdAt: nowIso() }] }));
    },
    updateLogo: (id, patch) => mutate((s) => ({ ...s, logos: s.logos.map((l) => (l.id === id ? { ...l, ...patch } : l)) })),
    removeLogo: (id) => mutate((s) => ({ ...s, logos: s.logos.filter((l) => l.id !== id) })),
    createCampaign: (input) => {
      if (!currentUser || currentUser.role !== "brand") return null;
      const campaign: Campaign = { ...input, id: uid("cmp"), brandId: currentUser.id, createdAt: nowIso() };
      mutate((s) => ({ ...s, campaigns: [...s.campaigns, campaign] }));
      return campaign;
    },
    updateCampaign: (id, patch) => mutate((s) => ({ ...s, campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
    reserveDeal: ({ athleteId, patchId, campaignId, logoId, placement, autoActivate }) => {
      if (!currentUser || currentUser.role !== "brand") return { ok: false, error: "Sign in as a brand to reserve." };
      if (isPatchLocked(state, patchId)) return { ok: false, error: "This placement is no longer available." };
      const athlete = state.athletes.find((a) => a.userId === athleteId);
      const patch = athlete?.patches.find((p) => p.id === patchId);
      const campaign = state.campaigns.filter((c) => c.brandId === currentUser.id).find((c) => c.id === campaignId);
      const logo = state.logos.find((l) => l.id === logoId && l.brandId === currentUser.id);
      const brand = state.brands.find((b) => b.userId === currentUser.id);
      if (!athlete || !patch) return { ok: false, error: "Unknown inventory." };
      if (!campaign) return { ok: false, error: "Select a campaign first." };
      if (!logo) return { ok: false, error: "Select a logo from your library." };
      if (!brand) return { ok: false, error: "Complete your brand profile." };
      const photo = athlete.photos.find((p) => p.id === patch.photoId) ?? athlete.photos[0];
      if (!photo) return { ok: false, error: "This athlete has no reference photo." };
      const snapshot: DealSnapshot = {
        athleteName: athlete.name, brandName: brand.name, campaignName: campaign.name, zone: patch.zone,
        patchName: patch.name, photoUrl: photo.dataUrl, photoSlot: photo.slot, logoUrl: logo.dataUrl,
        logoName: logo.name, placement: { ...placement }, price: patch.price, eventName: patch.eventName, periodLabel: patch.periodLabel,
      };
      const stamped = nowIso();
      const deal: Deal = {
        id: uid("deal"), athleteId, brandId: currentUser.id, campaignId, patchId,
        status: autoActivate ? "ACTIVE" : "RESERVED", snapshot, reservedAt: stamped,
        acceptedAt: autoActivate ? stamped : undefined, paidAt: autoActivate ? stamped : undefined, paymentMode: "DEMO",
      };
      mutate((s) => {
        if (isPatchLocked(s, patchId)) return s;
        return {
          ...s, deals: [...s.deals, deal],
          athletes: s.athletes.map((a) => a.userId === athleteId ? { ...a, patches: a.patches.map((p) => p.id === patchId ? { ...p, available: false } : p) } : a),
        };
      });
      return { ok: true, deal };
    },
    transitionDeal: (dealId, to) => {
      const current = state.deals.find((d) => d.id === dealId);
      if (!current) return { ok: false, error: "Deal not found." };
      if (!canTransition(current.status, to)) return { ok: false, error: `Cannot move from ${current.status} to ${to}.` };
      mutate((s) => {
        const deal = s.deals.find((d) => d.id === dealId);
        if (!deal || !canTransition(deal.status, to)) return s;
        return {
          ...s,
          deals: s.deals.map((d) => {
            if (d.id !== dealId) return d;
            const next: Deal = { ...d, status: to };
            if (to === "ACCEPTED") next.acceptedAt = nowIso();
            if (to === "PAID") next.paidAt = nowIso();
            if (to === "COMPLETED") { next.validatedAt = nowIso(); next.completedAt = nowIso(); }
            return next;
          }),
          athletes: s.athletes.map((a) => (to === "CANCELLED" || to === "REFUNDED")
            ? { ...a, patches: a.patches.map((p) => p.id === deal.patchId ? { ...p, available: true } : p) }
            : a),
        };
      });
      return { ok: true };
    },
    submitProof: (dealId, proof) => {
      const deal = state.deals.find((d) => d.id === dealId);
      if (!deal) return { ok: false, error: "Deal not found." };
      if (deal.status !== "ACTIVE") return { ok: false, error: "Proof can only be sent on an active deal." };
      mutate((s) => ({ ...s, deals: s.deals.map((d) => d.id === dealId ? { ...d, status: "PROOF_SUBMITTED", proof: { ...proof, submittedAt: nowIso() } } : d) }));
      return { ok: true };
    },
    resetDemo: () => setState(resetState()),
  }), [state, sync, currentUser, currentAthlete, currentBrand, mutate]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
