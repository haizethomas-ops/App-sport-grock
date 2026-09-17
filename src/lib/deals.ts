import type { AppState, Campaign, Deal, DealStatus } from "../types";
import { ACTIVE_DEAL_STATUSES } from "../types";

export function isBlockingStatus(status: DealStatus): boolean {
  return ACTIVE_DEAL_STATUSES.includes(status);
}
export function isPatchLocked(state: AppState, patchId: string, exceptDealId?: string): boolean {
  return state.deals.some((d) => d.patchId === patchId && isBlockingStatus(d.status) && d.id !== exceptDealId);
}
export function campaignSpend(state: AppState, campaignId: string) {
  const deals = state.deals.filter((d) => d.campaignId === campaignId);
  const reserved = deals.filter((d) => d.status === "RESERVED" || d.status === "ACCEPTED").reduce((s, d) => s + d.snapshot.price, 0);
  const paid = deals.filter((d) => ["PAID", "ACTIVE", "PROOF_SUBMITTED", "COMPLETED"].includes(d.status)).reduce((s, d) => s + d.snapshot.price, 0);
  return { reserved, committed: paid, paid, count: deals.length };
}
export function brandBudgetRollup(state: AppState, brandId: string) {
  const campaigns = state.campaigns.filter((c) => c.brandId === brandId);
  const total = campaigns.reduce((s, c) => s + c.budget, 0);
  const deals = state.deals.filter((d) => d.brandId === brandId);
  const reserved = deals.filter((d) => d.status === "RESERVED" || d.status === "ACCEPTED").reduce((s, d) => s + d.snapshot.price, 0);
  const paid = deals.filter((d) => ["PAID", "ACTIVE", "PROOF_SUBMITTED", "COMPLETED"].includes(d.status)).reduce((s, d) => s + d.snapshot.price, 0);
  return { total, reserved, paid, remaining: Math.max(0, total - reserved - paid), campaigns: campaigns.length, deals: deals.length };
}
export function canTransition(from: DealStatus, to: DealStatus): boolean {
  const map: Record<DealStatus, DealStatus[]> = {
    RESERVED: ["ACCEPTED", "CANCELLED"], ACCEPTED: ["PAID", "CANCELLED"], PAID: ["ACTIVE", "REFUNDED"],
    ACTIVE: ["PROOF_SUBMITTED", "REFUNDED"], PROOF_SUBMITTED: ["COMPLETED", "ACTIVE"], COMPLETED: [], CANCELLED: [], REFUNDED: [],
  };
  return map[from].includes(to);
}
export function campaignById(state: AppState, id: string): Campaign | undefined {
  return state.campaigns.find((c) => c.id === id);
}
export function nextActions(deal: Deal, role: "athlete" | "brand"): string[] {
  if (role === "athlete") {
    if (deal.status === "RESERVED") return ["Accept deal"];
    if (deal.status === "ACTIVE") return ["Submit proof"];
    return [];
  }
  if (deal.status === "ACCEPTED") return ["Pay (DEMO)"];
  if (deal.status === "PAID") return ["Activate"];
  if (deal.status === "PROOF_SUBMITTED") return ["Validate proof"];
  return [];
}
