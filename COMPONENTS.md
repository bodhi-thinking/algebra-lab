# Algebra Lab — Components

## Application

### `app/page.tsx`
Owns the selected challenge and initializes the shared Lab state. It does not implement mathematical representations.

### `app/layout.tsx`
Document shell and metadata.

## Challenge layer

### `components/ChallengeCard.tsx`
Learner-facing challenge shell: title, question, challenge visual, answer, hints, feedback and follow-up.

It may use `challengeType` to select challenge-specific presentation. It must not put representation logic here.

Renders the challenge-specific visual surface from challenge configuration. Challenge visuals are independent from the Lab store. A challenge may provide the Lab's initial state, while the Lab remains independently editable.

## Lab layer

### `components/lab/RepresentationGrid.tsx`
Responsive 2×2 desktop layout and tabbed mobile layout. It decides which panels are enabled by challenge configuration but does not contain mathematical logic.

### `components/lab/NumberLine.tsx`
Shows the output sequence as positions on a number line and lets the learner select an input/value pair.

### `components/lab/Graph.tsx`
Plots input against output for every visible equation. Selecting a point updates the shared selected input.

### `components/lab/AlgebraTiles.tsx`
Shows repeated unit structure and a compressed expression. Editing tiles updates the shared equation.

### `components/lab/EquationPanel.tsx`
Editable equation representation. Changes flow through the shared Zustand store to the other representations.

## State and types

### `lib/lab-store.ts`
Single source of truth for interactive mathematical state. It contains validation and bounds so user input cannot create invalid or unbounded rendering work.

### `lib/challenge-types.ts`
Challenge contracts plus pure helpers such as `checkAnswer`, `valueAt`, and `sequenceValues`.

### `lib/colors.ts`
Shared equation/representation color mapping.

## Architecture rule

Adding a normal challenge should not require changes to the files under `components/lab/`. Use `challengeType` for challenge-level branching; do not introduce a second discriminator name.

## Challenge ownership

Each challenge owns its visual under `challenges/<id>/ChallengeVisual.tsx`. `ChallengeCard` only provides the shared presentation shell and renders the visual component supplied by the challenge. Challenge-specific visuals do not belong in `components/`.
