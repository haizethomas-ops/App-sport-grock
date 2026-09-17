import type { AppState } from "../types";
import { buildSeed } from "../seed/seed";

export const STORAGE_KEY = "form_marketplace_v302";
export const STORAGE_VERSION = 2;

type Persisted = { version: number; state: AppState };

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildSeed();
    const parsed = JSON.parse(raw) as Persisted;
    if (!parsed || parsed.version !== STORAGE_VERSION || !parsed.state) return buildSeed();
    return {
      users: parsed.state.users ?? [],
      athletes: parsed.state.athletes ?? [],
      brands: parsed.state.brands ?? [],
      logos: parsed.state.logos ?? [],
      campaigns: parsed.state.campaigns ?? [],
      deals: parsed.state.deals ?? [],
      events: parsed.state.events ?? [],
      sessionUserId: parsed.state.sessionUserId ?? null,
    };
  } catch {
    return buildSeed();
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, state } satisfies Persisted));
}

export function resetState(): AppState {
  const next = buildSeed();
  saveState(next);
  return next;
}
