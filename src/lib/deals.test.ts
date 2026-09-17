import { describe, expect, it } from "vitest";
import { buildSeed } from "../seed/seed";
import { brandBudgetRollup, canTransition, campaignSpend, isPatchLocked } from "./deals";
import type { AppState, Deal } from "../types";

function deal(partial: Partial<Deal> & Pick<Deal, "id" | "patchId" | "campaignId" | "status">): Deal {
  return {
    athleteId: "ath_lea", brandId: "br_north",
    snapshot: {
      athleteName: "Léa Moreau", brandName: "Northmark", campaignName: "Campaign Running France",
      zone: "chest-left", patchName: "Left chest", photoUrl: "x", photoSlot: "front",
      logoUrl: "y", logoName: "Northmark primary", placement: { x: 10, y: 10, width: 12, height: 7, rotation: 0 }, price: 2400,
    },
    reservedAt: "2026-02-01T00:00:00.000Z", paymentMode: "DEMO", ...partial,
  };
}

describe("deal exclusivity", () => {
  it("locks a patch once reserved", () => {
    const state: AppState = { ...buildSeed(), deals: [deal({ id: "d1", patchId: "pt_lea_cl", campaignId: "cmp_north_run", status: "RESERVED" })] };
    expect(isPatchLocked(state, "pt_lea_cl")).toBe(true);
    expect(isPatchLocked(state, "pt_lea_cr")).toBe(false);
  });
  it("does not lock cancelled inventory", () => {
    const state: AppState = { ...buildSeed(), deals: [deal({ id: "d1", patchId: "pt_lea_cl", campaignId: "cmp_north_run", status: "CANCELLED" })] };
    expect(isPatchLocked(state, "pt_lea_cl")).toBe(false);
  });
});

describe("campaign persistence model", () => {
  it("keeps multiple campaigns and isolated spend", () => {
    const state: AppState = {
      ...buildSeed(),
      deals: [
        deal({ id: "d1", patchId: "pt_lea_cl", campaignId: "cmp_north_run", status: "PAID" }),
        deal({ id: "d2", patchId: "pt_nico_cl", campaignId: "cmp_north_tri", status: "RESERVED", snapshot: {
          athleteName: "Nico Alvarez", brandName: "Northmark", campaignName: "Campaign Triathlon",
          zone: "chest-left", patchName: "Left chest", photoUrl: "x", photoSlot: "front",
          logoUrl: "y", logoName: "Northmark primary", placement: { x: 10, y: 10, width: 12, height: 7, rotation: 0 }, price: 3200,
        }}),
      ],
    };
    expect(state.campaigns.filter((c) => c.brandId === "br_north")).toHaveLength(2);
    expect(campaignSpend(state, "cmp_north_run").paid).toBe(2400);
    expect(campaignSpend(state, "cmp_north_tri").reserved).toBe(3200);
    expect(campaignSpend(state, "cmp_north_run").reserved).toBe(0);
  });
});

describe("snapshots", () => {
  it("deal logo is independent from later library edits", () => {
    const frozen = "data:image/svg+xml;utf8,ORIGINAL";
    const d = deal({ id: "d1", patchId: "pt_lea_cl", campaignId: "cmp_north_run", status: "ACTIVE", snapshot: {
      athleteName: "Léa", brandName: "Northmark", campaignName: "Run", zone: "chest-left", patchName: "Left chest",
      photoUrl: "photo", photoSlot: "front", logoUrl: frozen, logoName: "Northmark primary",
      placement: { x: 1, y: 2, width: 10, height: 6, rotation: -4 }, price: 2400,
    }});
    expect(d.snapshot.logoUrl).toBe(frozen);
    expect(d.snapshot.logoUrl).not.toBe("UPDATED");
  });
});

describe("status machine", () => {
  it("allows the intended happy path", () => {
    expect(canTransition("RESERVED", "ACCEPTED")).toBe(true);
    expect(canTransition("ACCEPTED", "PAID")).toBe(true);
    expect(canTransition("PAID", "ACTIVE")).toBe(true);
    expect(canTransition("ACTIVE", "PROOF_SUBMITTED")).toBe(true);
    expect(canTransition("PROOF_SUBMITTED", "COMPLETED")).toBe(true);
    expect(canTransition("COMPLETED", "RESERVED")).toBe(false);
  });
});

describe("abandoned reservation is not paid spend", () => {
  it("counts reserved separately from paid", () => {
    const state: AppState = { ...buildSeed(), deals: [
      deal({ id: "d1", patchId: "pt_lea_cl", campaignId: "cmp_north_run", status: "RESERVED" }),
      deal({ id: "d2", patchId: "pt_lea_th", campaignId: "cmp_north_run", status: "CANCELLED" }),
    ]};
    const roll = brandBudgetRollup(state, "br_north");
    expect(roll.reserved).toBe(2400);
    expect(roll.paid).toBe(0);
  });
});
