# FORM — athlete visibility marketplace

Working name. Photo-first sports sponsorship inventory.

An athlete is a physical medium. A zone on the body or kit is inventory. A reservation is a limited sponsorship right, frozen at purchase time on the athlete’s real photo.

This is the V30.2 product pass: photo-first 2D placement, shared Athlete ↔ Brand data, multi-campaigns, clickable portfolio / deal rooms, DEMO payments, immutable deal snapshots.

The previous GitHub repo `haizethomas-ops/athlete-sponsor-platform` was not reachable (404). `haizethomas-ops/App-sport-grock` was empty. This package reconstructs the V29/V30.1 product decisions rather than inventing a new concept.

## Stack

Vite + React 18 + TypeScript + React Router.

No backend. Persistence is a versioned `localStorage` document shared by every account in the same browser. That is enough to demonstrate the marketplace locally and on StackBlitz. It is **not** a production database.

## Install and run

```bash
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

```bash
npm run build
npm run preview
npm test
```

## StackBlitz

Open this repo (not a nested folder):

https://stackblitz.com/github/haizethomas-ops/App-sport-grock

If it hangs on “Installing dependencies”, refresh once. `jsdom` was removed from the default install because it often freezes WebContainers. The app only needs Vite + React.

## Demo accounts

Password for every seeded account: `demo`

| Role | Email | Notes |
| --- | --- | --- |
| Athlete (empty) | `athlete@form.demo` | Create a profile from scratch |
| Athlete | `lea@form.demo` | Published trail athlete |
| Athlete | `nico@form.demo` | Published triathlon athlete |
| Brand | `brand@form.demo` | Northmark — two campaigns, two logos |
| Brand | `pulse@form.demo` | Second brand for exclusivity tests |

A demo switcher at the top of Athlete / Brand shells lets you hop accounts without losing shared data. Reset demo data from that same bar.

## Environment

Copy `.env.example` if you need local overrides.

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_DEMO_MODE` | `true` | Full journey without cards |
| `VITE_STRIPE_PUBLISHABLE_KEY` | unset | Placeholder only |

Never put a Stripe secret key in this repository.

## What is real in this build

- Athlete profile, photos (data URL uploads), zones, publish
- Brand Discover sees the **same** published photos and patches
- Patch editor: move, proportional resize, rotate, undo
- Logo library with multiple variants
- Multi-campaign create / list / detail (A is not deleted when B is created)
- Reserve + DEMO pay with exclusive lock on the patch
- Deal snapshot (photo, logo, placement, price, campaign name) stored on the deal
- Portfolio and Deal Rooms are real routes
- Athlete proof upload + brand validation
- Brand Hub name syncs in the shell
- Events calendar → athlete profile
- Vitest coverage for exclusivity, campaign isolation, snapshot independence, status machine

## What still needs infrastructure for production

- **Auth** — demo passwords live in localStorage. Replace with a real IdP.
- **Database** — move `src/lib/storage.ts` to an API + Postgres. Keep the same document shape.
- **File storage** — photos and logos should go to object storage, not data URLs.
- **Stripe** — Checkout + Connect + webhooks are not live. DEMO payment only writes deal status.
- **Concurrency** — lock is atomic inside one browser store. Multi-device needs a transactional backend.
- **3D** — intentionally not in the product path.

## Suggested QA path

1. Sign in as `athlete@form.demo`, fill profile, upload photos, add zones, publish.
2. Switch to `brand@form.demo`. Confirm the athlete appears with those photos.
3. Create Campaign A, Campaign B, Campaign C. Reload. All three remain.
4. Buy a patch into Campaign A (logo → fit → DEMO pay).
5. Open Portfolio → collaboration → Deal Room. Check photo, zone, logo, placement, price, campaign.
6. Switch back to the athlete, submit proof. Brand validates. Status = COMPLETED.
7. In Brand Hub, tap **Replace (test immutability)** on the logo. The old deal still shows the original mark.
8. As `pulse@form.demo`, try the same patch. You should get “no longer available”.
9. Reload. Data is still there.

## Naming

Commercial name is not locked. The product UI uses **FORM**.
