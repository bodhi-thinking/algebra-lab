# Algebra Lab — prototype

One mathematical model. Four representations.

This is the first development milestone from the spec: the interaction
engine and challenge architecture, wired up to **one sample challenge**
("Challenge 01 — Equal Jumps", `y = 3x + 2`). The challenge series itself
is intentionally not built out yet — see `lib/challenges.ts`.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. (`npm run build` fetches Fraunces / IBM
Plex Sans / IBM Plex Mono from Google Fonts at build time, so it needs
network access — this works out of the box on Vercel.)

## Deploy

Push to a repo and import it in Vercel — no environment variables or
backend needed for this version.

## Architecture

- `lib/types.ts` — the shared math model (`EquationModel`, `LabState`,
  `Challenge`) and pure functions (`valueAt`, `jumpSequence`,
  `formatEquation`).
- `lib/store.ts` — a single Zustand store. Every representation reads
  from and writes to this store; nothing computes its own local copy of
  the model. This is what makes "change one, watch the other three
  update" work.
- `lib/colors.ts` — equation identity (color + line-dash) shared by the
  number line, graph, and equation panel so an equation looks the same
  everywhere.
- `lib/challenges.ts` — challenge data. Add more `Challenge` objects here
  and they'll show up once you wire in a challenge switcher (not built
  yet — out of scope for this milestone).
- `components/` — the four representations (`NumberLine`, `Graph`,
  `EquationPanel`, `AlgebraTiles`) plus `ChallengeHeader` for the prompt
  and progressive hints. Each reads the active equation(s) straight from
  the store.

## What's deliberately not built yet

Per the spec: accounts, backend, analytics, gamification, the full
40-challenge progression, and the richer x²/xy/y² tile set. The
`Challenge` type's `enabledRepresentations` flag already supports
turning panels on/off per challenge, and `allowAddEquation` supports
comparison challenges — the architecture is ready, the content isn't.

## A note on the visual design

Deliberately not the "AI worksheet" or "graphing calculator" look: paper
background, a serif display face (Fraunces) for headings, monospace
(IBM Plex Mono) for anything numeric so equations and coordinates read
like a lab notebook rather than a UI. Equation identity is color *and*
line-style (solid/dashed/dotted) together, never color alone. The
number-line jump arcs are the signature element — they're what the
whole "repeated jump" idea in the spec is actually about.
