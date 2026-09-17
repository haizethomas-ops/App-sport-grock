import type { AppState, AthleteProfile, BrandLogo, Campaign } from "../types";
import { svgLogo } from "./logos";

const P = {
  leaFront: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
  leaSide: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=80",
  leaBack: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=1200&q=80",
  leaAction: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1200&q=80",
  nicoFront: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80",
  nicoSide: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80",
  nicoAction: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
  mayaFront: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1200&q=80",
  mayaAction: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=1200&q=80",
  tomFront: "https://images.unsplash.com/photo-1502904550040-753459742ad8?auto=format&fit=crop&w=1200&q=80",
  tomAction: "https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?auto=format&fit=crop&w=1200&q=80",
};

const northMark = svgLogo({ text: "NORTH", bg: "#111111", fg: "#E8FF3D", sub: "MARK" });
const northWhite = svgLogo({ text: "NORTH", bg: "#F4F4F0", fg: "#111111", sub: "MARK" });
const pulse = svgLogo({ text: "PULSE", bg: "#0B1F2A", fg: "#7CFFCB", sub: "NUTRITION" });

export function buildSeed(): AppState {
  const lea: AthleteProfile = {
    userId: "ath_lea", name: "Léa Moreau", sport: "Trail", discipline: "Ultra-trail",
    location: "Chamonix", country: "France", level: "Elite", gender: "female",
    bio: "UTMB finisher. Clean lines, no noise — visibility sold the same way I race.",
    avatarUrl: P.leaFront, audience: 86400,
    stats: [{ label: "UTMB", value: "22h 14" }, { label: "Races / yr", value: "8" }, { label: "IG ER", value: "4.8%" }],
    socials: { instagram: "@leamoreau.trail", strava: "lea-moreau", tiktok: "@lea.runs" },
    events: [
      { id: "ev1", name: "UTMB CCC", date: "2026-08-28", city: "Chamonix" },
      { id: "ev2", name: "SaintéLyon", date: "2026-12-06", city: "Lyon" },
    ],
    photos: [
      { id: "ph_lea_f", slot: "front", dataUrl: P.leaFront, createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "ph_lea_l", slot: "left", dataUrl: P.leaSide, createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "ph_lea_b", slot: "back", dataUrl: P.leaBack, createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "ph_lea_a", slot: "action1", dataUrl: P.leaAction, createdAt: "2026-01-01T00:00:00.000Z" },
    ],
    patches: [
      { id: "pt_lea_cl", name: "Left chest", zone: "chest-left", price: 2400, available: true, photoId: "ph_lea_f", placement: { x: 38, y: 28, width: 14, height: 8, rotation: -6 }, eventName: "UTMB CCC", periodLabel: "Aug 2026" },
      { id: "pt_lea_cr", name: "Right chest", zone: "chest-right", price: 2400, available: true, photoId: "ph_lea_f", placement: { x: 54, y: 28, width: 14, height: 8, rotation: 6 } },
      { id: "pt_lea_th", name: "Left thigh", zone: "thigh-left", price: 1600, available: true, photoId: "ph_lea_f", placement: { x: 36, y: 62, width: 16, height: 9, rotation: -4 } },
      { id: "pt_lea_bk", name: "Back panel", zone: "back", price: 2800, available: true, photoId: "ph_lea_b", placement: { x: 42, y: 30, width: 18, height: 10, rotation: 0 } },
    ],
    published: true,
  };

  const nico: AthleteProfile = {
    userId: "ath_nico", name: "Nico Alvarez", sport: "Triathlon", discipline: "Ironman 70.3",
    location: "Barcelona", country: "Spain", level: "Pro", gender: "male",
    bio: "70.3 specialist. Swim-bike-run inventory that actually gets filmed on course.",
    avatarUrl: P.nicoFront, audience: 121000,
    stats: [{ label: "70.3 PB", value: "3:54" }, { label: "Starts", value: "14" }],
    socials: { instagram: "@nico.tri", youtube: "NicoTri" },
    events: [{ id: "ev3", name: "Ironman 70.3 Nice", date: "2026-06-21", city: "Nice" }],
    photos: [
      { id: "ph_nico_f", slot: "front", dataUrl: P.nicoFront, createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "ph_nico_s", slot: "left", dataUrl: P.nicoSide, createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "ph_nico_a", slot: "action1", dataUrl: P.nicoAction, createdAt: "2026-01-01T00:00:00.000Z" },
    ],
    patches: [
      { id: "pt_nico_cl", name: "Left chest", zone: "chest-left", price: 3200, available: true, photoId: "ph_nico_f", placement: { x: 39, y: 30, width: 13, height: 8, rotation: -4 } },
      { id: "pt_nico_sh", name: "Left shoulder", zone: "shoulder-left", price: 1800, available: true, photoId: "ph_nico_s", placement: { x: 30, y: 26, width: 16, height: 9, rotation: -12 } },
      { id: "pt_nico_sw", name: "Shorts", zone: "shorts", price: 1100, available: true, photoId: "ph_nico_f", placement: { x: 44, y: 58, width: 14, height: 8, rotation: 0 } },
    ],
    published: true,
  };

  const maya: AthleteProfile = {
    userId: "ath_maya", name: "Maya Chen", sport: "Fitness", discipline: "Hyrox / Strength",
    location: "Berlin", country: "Germany", level: "Semi-pro", gender: "female",
    bio: "Hyrox and studio work. High-visibility kits, high-frequency content.",
    avatarUrl: P.mayaFront, audience: 210000,
    stats: [{ label: "Hyrox", value: "1:12" }],
    socials: { instagram: "@maya.hyrox", tiktok: "@mayafit" },
    events: [{ id: "ev4", name: "Hyrox Paris", date: "2026-05-09", city: "Paris" }],
    photos: [
      { id: "ph_maya_f", slot: "front", dataUrl: P.mayaFront, createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "ph_maya_a", slot: "action1", dataUrl: P.mayaAction, createdAt: "2026-01-01T00:00:00.000Z" },
    ],
    patches: [
      { id: "pt_maya_bra", name: "Sports bra", zone: "sports-bra", price: 2600, available: true, photoId: "ph_maya_f", placement: { x: 42, y: 32, width: 16, height: 8, rotation: 0 } },
      { id: "pt_maya_th", name: "Right thigh", zone: "thigh-right", price: 1500, available: true, photoId: "ph_maya_f", placement: { x: 52, y: 64, width: 15, height: 8, rotation: 4 } },
    ],
    published: true,
  };

  const tom: AthleteProfile = {
    userId: "ath_tom", name: "Tom Rivière", sport: "Running", discipline: "Road 10k / Half",
    location: "Nantes", country: "France", level: "Amateur+", gender: "male",
    bio: "Club runner with a serious local following. Good for regional campaigns.",
    avatarUrl: P.tomFront, audience: 18400,
    stats: [{ label: "10k", value: "31:40" }],
    socials: { instagram: "@tom.riviere", strava: "tom-riviere" },
    events: [{ id: "ev5", name: "Semi de Paris", date: "2026-03-08", city: "Paris" }],
    photos: [
      { id: "ph_tom_f", slot: "front", dataUrl: P.tomFront, createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "ph_tom_a", slot: "action1", dataUrl: P.tomAction, createdAt: "2026-01-01T00:00:00.000Z" },
    ],
    patches: [
      { id: "pt_tom_cl", name: "Left chest", zone: "chest-left", price: 650, available: true, photoId: "ph_tom_f", placement: { x: 38, y: 30, width: 14, height: 8, rotation: -5 } },
    ],
    published: true,
  };

  const logos: BrandLogo[] = [
    { id: "lg_north_main", brandId: "br_north", name: "Northmark primary", dataUrl: northMark, version: "2026 Q1", tags: ["primary", "dark"], background: "dark", active: true, createdAt: "2026-01-01T00:00:00.000Z" },
    { id: "lg_north_white", brandId: "br_north", name: "Northmark light", dataUrl: northWhite, version: "2026 Q1", tags: ["light"], background: "light", active: true, createdAt: "2026-01-01T00:00:00.000Z" },
    { id: "lg_pulse", brandId: "br_pulse", name: "Pulse Nutrition", dataUrl: pulse, version: "v3", tags: ["primary"], background: "dark", active: true, createdAt: "2026-01-01T00:00:00.000Z" },
  ];

  const campaigns: Campaign[] = [
    { id: "cmp_north_run", brandId: "br_north", name: "Campaign Running France", objective: "Awareness on elite trail and road starts", budget: 25000, startDate: "2026-03-01", endDate: "2026-09-30", status: "active", createdAt: "2026-01-10T00:00:00.000Z" },
    { id: "cmp_north_tri", brandId: "br_north", name: "Campaign Triathlon", objective: "Product launch on 70.3 circuit", budget: 18000, startDate: "2026-04-01", endDate: "2026-08-31", status: "active", createdAt: "2026-01-12T00:00:00.000Z" },
  ];

  return {
    users: [
      { id: "ath_lea", email: "lea@form.demo", password: "demo", role: "athlete", createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "ath_nico", email: "nico@form.demo", password: "demo", role: "athlete", createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "ath_maya", email: "maya@form.demo", password: "demo", role: "athlete", createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "ath_tom", email: "tom@form.demo", password: "demo", role: "athlete", createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "ath_you", email: "athlete@form.demo", password: "demo", role: "athlete", createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "br_north", email: "brand@form.demo", password: "demo", role: "brand", createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "br_pulse", email: "pulse@form.demo", password: "demo", role: "brand", createdAt: "2026-01-01T00:00:00.000Z" },
    ],
    athletes: [
      lea, nico, maya, tom,
      { userId: "ath_you", name: "", sport: "", discipline: "", location: "", country: "France", level: "Amateur", gender: "female", bio: "", avatarUrl: "", audience: 0, stats: [], socials: {}, events: [], photos: [], patches: [], published: false },
    ],
    brands: [
      { userId: "br_north", name: "Northmark", logoUrl: northMark, description: "Technical apparel for endurance athletes.", website: "https://northmark.demo", sector: "Apparel", country: "France", legalName: "Northmark SAS", members: [
        { id: "m1", name: "Camille Dufour", role: "Sponsorship lead", email: "camille@northmark.demo" },
        { id: "m2", name: "Jonas Weber", role: "Brand manager", email: "jonas@northmark.demo" },
      ]},
      { userId: "br_pulse", name: "Pulse Nutrition", logoUrl: pulse, description: "Endurance nutrition.", website: "https://pulse.demo", sector: "Nutrition", country: "Spain", legalName: "Pulse Nutrition SL", members: [{ id: "m3", name: "Ana Ruiz", role: "Partnerships", email: "ana@pulse.demo" }] },
    ],
    logos, campaigns, deals: [],
    events: [
      { id: "cal1", name: "Semi de Paris", date: "2026-03-08", city: "Paris", sport: "Running", athleteIds: ["ath_tom"] },
      { id: "cal2", name: "Hyrox Paris", date: "2026-05-09", city: "Paris", sport: "Fitness", athleteIds: ["ath_maya"] },
      { id: "cal3", name: "Ironman 70.3 Nice", date: "2026-06-21", city: "Nice", sport: "Triathlon", athleteIds: ["ath_nico"] },
      { id: "cal4", name: "UTMB CCC", date: "2026-08-28", city: "Chamonix", sport: "Trail", athleteIds: ["ath_lea"] },
      { id: "cal5", name: "SaintéLyon", date: "2026-12-06", city: "Lyon", sport: "Trail", athleteIds: ["ath_lea"] },
    ],
    sessionUserId: null,
  };
}
