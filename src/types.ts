export type Role = "athlete" | "brand";
export type PhotoSlot = "front" | "left" | "right" | "back" | "action1" | "action2";
export type PatchZone =
  | "chest-left" | "chest-right" | "shoulder-left" | "shoulder-right"
  | "thigh-left" | "thigh-right" | "back" | "shorts" | "sports-bra";
export type DealStatus =
  | "RESERVED" | "ACCEPTED" | "PAID" | "ACTIVE" | "PROOF_SUBMITTED"
  | "COMPLETED" | "CANCELLED" | "REFUNDED";
export type PatchStatus = "available" | "reserved" | "sold";

export interface User { id: string; email: string; password: string; role: Role; createdAt: string; }
export interface Socials { instagram?: string; tiktok?: string; strava?: string; youtube?: string; }
export interface Photo { id: string; slot: PhotoSlot; dataUrl: string; createdAt: string; }
export interface Placement { x: number; y: number; width: number; height: number; rotation: number; }
export interface Patch {
  id: string; name: string; zone: PatchZone; price: number; available: boolean;
  photoId: string; placement: Placement; eventName?: string; periodLabel?: string;
}
export interface UpcomingEvent { id: string; name: string; date: string; city: string; }
export interface AthleteProfile {
  userId: string; name: string; sport: string; discipline: string; location: string; country: string;
  level: string; gender: "female" | "male" | "other"; bio: string; avatarUrl: string; audience: number;
  stats: { label: string; value: string }[]; socials: Socials; events: UpcomingEvent[];
  photos: Photo[]; patches: Patch[]; published: boolean;
}
export interface BrandMember { id: string; name: string; role: string; email: string; }
export interface BrandProfile {
  userId: string; name: string; logoUrl: string; description: string; website: string;
  sector: string; country: string; legalName: string; members: BrandMember[];
}
export interface BrandLogo {
  id: string; brandId: string; name: string; dataUrl: string; version: string;
  tags: string[]; background: "light" | "dark"; active: boolean; createdAt: string;
}
export interface Campaign {
  id: string; brandId: string; name: string; objective: string; budget: number;
  startDate: string; endDate: string; status: "draft" | "active" | "closed"; createdAt: string;
}
export interface Proof { kind: "photo" | "link" | "video"; dataUrl?: string; url?: string; note?: string; submittedAt: string; }
export interface DealSnapshot {
  athleteName: string; brandName: string; campaignName: string; zone: PatchZone; patchName: string;
  photoUrl: string; photoSlot: PhotoSlot; logoUrl: string; logoName: string; placement: Placement;
  price: number; eventName?: string; periodLabel?: string;
}
export interface Deal {
  id: string; athleteId: string; brandId: string; campaignId: string; patchId: string;
  status: DealStatus; snapshot: DealSnapshot; reservedAt: string; acceptedAt?: string; paidAt?: string;
  proof?: Proof; validatedAt?: string; completedAt?: string; paymentMode: "DEMO" | "STRIPE";
}
export interface CalendarEvent { id: string; name: string; date: string; city: string; sport: string; athleteIds: string[]; }
export interface AppState {
  users: User[]; athletes: AthleteProfile[]; brands: BrandProfile[]; logos: BrandLogo[];
  campaigns: Campaign[]; deals: Deal[]; events: CalendarEvent[]; sessionUserId: string | null;
}

export const ZONE_LABEL: Record<PatchZone, string> = {
  "chest-left": "Left chest", "chest-right": "Right chest", "shoulder-left": "Left shoulder",
  "shoulder-right": "Right shoulder", "thigh-left": "Left thigh", "thigh-right": "Right thigh",
  back: "Back", shorts: "Shorts", "sports-bra": "Sports bra",
};
export const SLOT_LABEL: Record<PhotoSlot, string> = {
  front: "Front", left: "Left side", right: "Right side", back: "Back", action1: "Action 1", action2: "Action 2",
};
export const PHOTO_SLOTS: PhotoSlot[] = ["front", "left", "right", "back", "action1", "action2"];
export const DEFAULT_PATCHES: { zone: PatchZone; name: string; price: number }[] = [
  { zone: "chest-left", name: "Left chest", price: 1800 },
  { zone: "chest-right", name: "Right chest", price: 1800 },
  { zone: "shoulder-left", name: "Left shoulder", price: 1200 },
  { zone: "thigh-left", name: "Left thigh", price: 1400 },
  { zone: "back", name: "Back panel", price: 2200 },
  { zone: "shorts", name: "Shorts", price: 900 },
];
export const ACTIVE_DEAL_STATUSES: DealStatus[] = ["RESERVED", "ACCEPTED", "PAID", "ACTIVE", "PROOF_SUBMITTED"];
