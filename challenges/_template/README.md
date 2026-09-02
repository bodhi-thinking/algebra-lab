# Challenge template

Create a new challenge as a self-contained folder:

- `challenge.ts` — question, answer, hints, Lab initialization and challenge metadata.
- `ChallengeVisual.tsx` — everything specific to rendering this challenge's visual.
- `assets/` — optional challenge-specific assets.

After creating the folder, register the challenge once in `challenges/index.ts`.

Do not add challenge-specific rendering logic to shared components.
