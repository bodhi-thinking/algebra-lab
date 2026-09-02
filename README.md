# Algebra Lab

A small interactive algebra-learning lab built around one shared mathematical model and four connected representations:

- Number Line
- Graph
- Algebra Tiles
- Equation

The challenge provides the mathematical context and the Lab provides an independent space for changing parameters and comparing representations.

## Challenge series

The first three challenges are currently registered:

1. **The Dot Trail** — 1, 2, 3, 4, …
2. **Even Steps** — 2, 4, 6, 8, …
3. **Odd Steps** — 1, 3, 5, 7, …

The challenge visual is owned by the challenge folder. This is intentional: future challenges can use completely different visual forms such as trees, triangles, matchsticks, geometric constructions, or animations without adding branches to a shared renderer.

## Project structure

```text
app/
  page.tsx
  layout.tsx
  globals.css

challenges/
  _template/
    challenge.ts
    ChallengeVisual.tsx
  001-dot-trail/
    challenge.ts
    ChallengeVisual.tsx
    assets/
  002-even-steps/
    challenge.ts
    ChallengeVisual.tsx
  003-odd-steps/
    challenge.ts
    ChallengeVisual.tsx
  index.ts

components/
  ChallengeCard.tsx
  lab/
    RepresentationGrid.tsx
    NumberLine.tsx
    AlgebraTiles.tsx
    Graph.tsx
    EquationPanel.tsx

lib/
  challenge-types.ts
  lab-store.ts
  colors.ts

public/challenges/
  001-dot-trail/assets/pattern.jpg   # reference asset
```

## Adding a challenge

Create a self-contained folder under `challenges/<id>/` containing:

- `challenge.ts` — challenge content and initial Lab state.
- `ChallengeVisual.tsx` — all rendering specific to that challenge.
- `assets/` — optional challenge-specific assets.

Then add one import and one entry to `challenges/index.ts`.

Do not put challenge-specific visual branches in `components/ChallengeCard.tsx` or `components/lab/`.

## Run locally

The project is prepared for Node 20.9+ and npm 11.

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Quality checks

```bash
npm run typecheck
npm run build
```

The repository intentionally does not include `node_modules`, `.next`, macOS metadata, or a machine-generated `package-lock.json`. Run `npm install` once after extracting the project to generate a fresh lockfile for the current dependency set.
