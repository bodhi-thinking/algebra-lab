# Algebra Lab — Product & Architecture Design

## 1. Purpose

Algebra Lab is a self-directed exploration space built around one principle:

> **One mathematical idea. Different ways to see it.**

A learner begins with a challenge, notices or predicts something, and then explores the same mathematical relationship through connected representations.

The four representations are:

1. **Number Line** — movement, repeated change, direction, growth.
2. **Algebra Tiles** — quantities, repeated groups, structure and expression.
3. **Graph** — input/output, covariation and relationships.
4. **Equation** — a compact description of the relationship.

These are **not four separate activities**. They are four views of the same underlying mathematical model.

---

## 2. Core Architecture

The application has three layers:

```text
CHALLENGE CONTENT
      │
      │ challenge configuration
      ▼
CHALLENGE EXPERIENCE
      │
      │ initializes / frames the model
      ▼
SHARED LAB ENGINE
      │
      ├── Number Line
      ├── Algebra Tiles
      ├── Graph
      └── Equation
```

The challenge changes. The Lab engine should remain stable.

### Architectural rule

> **Adding a normal challenge should require a new challenge folder and registration, not edits to the four representation components.**

Only genuinely new mathematical behavior should require an engine change.

---

## 3. Challenge vs. Lab

### The Challenge owns

- title
- question
- answer
- hints
- feedback
- follow-up prompt
- challenge-specific visual configuration
- enabled representations
- initial mathematical state
- challenge-specific assets

### The Lab owns

- mathematical state
- synchronization between representations
- number line rendering
- graph rendering
- algebra tile rendering
- equation editing
- multi-equation support
- input validation and state bounds

This keeps content separate from implementation.

---

## 4. `challengeType`

The challenge discriminator is named **`challengeType`**.

Current types:

```ts
"pattern" | "linear"
```

`challengeType` belongs to the challenge definition. It is **not stored in the Lab store** and is **not used by the reusable Number Line, Graph, Algebra Tiles or Equation components**.

The Challenge Card may use `challengeType` to select a challenge-specific visual or presentation. A challenge visual is an independent learning prompt. It may define the Lab's initial state, but it is not live-bound to the Lab state.

This avoids spreading challenge-specific conditions throughout the Lab engine.

### Do not reintroduce

```ts
challengeType
```

or conditions such as:

```ts
if (challengeType === "pattern")
```

inside reusable representation components.

---

## 5. Shared Mathematical State

The Lab store represents mathematical state, not pedagogical labels.

Current state:

```ts
{
  equations,
  activeEquationId,
  inputStart,
  inputCount,
  selectedInput,
  numberLineRange
}
```

The central relationship is represented by the equation:

```text
y = coefficient × x + constant
```

For Challenge 1:

```text
y = x
```

The same relationship is interpreted by all representations.

```text
             y = x
               │
       ┌───────┼────────┐
       │       │        │
       ▼       ▼        ▼
 Number Line  Graph    Tiles
       │       │        │
       └───────┼────────┘
               │
          Challenge
```

The Lab's selected value is independent from the challenge visual. Selecting a value inside the Lab synchronizes the Number Line, Graph and Tiles through the shared `selectedInput` state.

---

## 6. Challenge 1 — The Dot Trail

The first challenge is **The Dot Trail**.

The learner sees six figures:

```text
1   2   3   4   5   6
●  ●●  ●●●  ●●●●  ●●●●●  ●●●●●●
```

The learner is asked:

> **The pattern keeps growing. How many dots will there be in Figure 10?**

The challenge starts with:

```text
y = x
```

and the visual pattern is presented as a static challenge image.

The challenge visual is independent from the Lab state. The challenge may provide the Lab's initial state, but editing the Lab never changes the challenge image or challenge answer.

### Intended progression

```text
See
  ↓
Notice
  ↓
Predict
  ↓
Select / explore a figure
  ↓
See it on the Number Line
  ↓
See it on the Graph
  ↓
Build the repeated structure with Tiles
  ↓
Describe it with an Equation
```

Formal terminology should not be required before the learner has something meaningful to describe.

---

## 7. Challenge Folder Structure

Challenges live outside the reusable Lab components.

```text
challenges/
│
├── _template/
│   ├── challenge.ts
│   └── README.md
│
├── 001-dot-trail/
│   ├── challenge.ts
│   ├── README.md
│   └── assets/
│       └── pattern.jpg
│
├── 002-example/
│   ├── challenge.ts
│   └── assets/
│
└── index.ts
```

### Why folders?

A challenge is a small content package. Keeping its definition and assets together makes it easy to:

- find
- edit
- review
- version
- replace
- eventually export to a content system

`challenges/index.ts` is the only registry required by the current application.

---

## 8. Challenge Template

To create a normal challenge:

1. Copy `challenges/_template`.
2. Give it a numbered, descriptive folder name.
3. Edit `challenge.ts`.
4. Add assets inside the challenge folder.
5. Register it in `challenges/index.ts`.
6. Run the project's type/build checks.

Do **not** modify the Lab panels simply to add a challenge.

---

## 9. Reusable Components

```text
components/
│
├── ChallengeCard.tsx
│
├── challenge/
│   └── ChallengeVisual.tsx
│
└── lab/
    ├── RepresentationGrid.tsx
    ├── NumberLine.tsx
    ├── AlgebraTiles.tsx
    ├── Graph.tsx
    └── EquationPanel.tsx
```

### Challenge components

These provide challenge-specific presentation.

### Lab components

These are reusable representations and should not know which challenge is active.

---

## 10. Challenge Card Interaction

The Challenge Card owns only challenge interaction state:

- answer input
- answer status
- revealed hints

It also exposes Previous / Next navigation at the top of the card. Navigation is controlled by `app/page.tsx`, so the card does not need to know how the challenge collection is stored.

The current series is planned as 10 challenges. Until all ten are registered, navigation buttons remain visible but are disabled when no adjacent challenge is actually available.

Challenge 1 uses the supplied JPG as its visual reference, but the learner-facing pattern is rendered responsively in React/CSS. The challenge visual remains independent of the Lab state. The Lab remains an editable exploration environment whose representations share one mathematical state.

---

## 11. State Management

`lib/lab-store.ts` is the single source of truth for interactive mathematical state.

The store is deliberately small.

It is responsible for:

- loading an initial state
- changing equations
- changing the input range/count
- changing the selected input
- changing the number-line range
- adding/removing equations
- validating and bounding numeric values

It is not responsible for:

- challenge questions
- hints
- answer checking UI
- challenge type
- visual challenge assets

---

## 12. Mathematical Helpers

`lib/challenge-types.ts` contains shared types and pure mathematical helpers.

Important helpers:

- `checkAnswer`
- `valueAt`
- `sequenceValues`

`sequenceValues` provides shared sequence data for the Lab representations rather than maintaining separate implementations.

---

## 13. Performance and Safety

The Lab is intentionally bounded because several components create repeated DOM/SVG elements.

Current protections include:

- maximum number of equations: 3
- bounded coefficient and constant values
- bounded input count
- bounded input start
- bounded number-line range
- bounded concrete tile rendering
- bounded challenge dot rendering
- no dynamic code evaluation
- no `dangerouslySetInnerHTML`
- user text rendered through React rather than HTML injection

### Important rule

Never allow an input to directly determine an unbounded `Array.from({ length: ... })` or SVG element count.

Any future challenge visual must clamp its rendering size independently of the mathematical value.

---

## 14. Accessibility

Interactive mathematical points should be keyboard reachable where practical.

Controls should have:

- visible labels or meaningful `aria-label`s
- keyboard activation
- focus-visible styling
- disabled states where appropriate

SVGs should have meaningful `role="img"` and `aria-label` descriptions.

---

## 15. Challenge Switching

Changing challenges must reset both:

1. the shared mathematical Lab state
2. local Challenge Card interaction state

The active challenge card is keyed by `challenge.id`, and its local state is also reset when the challenge changes.

This prevents answers, hints or feedback from Challenge 1 leaking into Challenge 2.

---

## 16. Responsive Lab Layout

The four representations appear as a 2×2 grid on desktop. On small screens they become tabs, with Number Line as the default. Switching tabs changes only the visible panel; it does not reset the shared mathematical state.

---

## 17. Adding Future Challenges

The preferred progression is:

### Challenge-owned visuals

Each challenge owns its visual component inside its own folder. Shared mathematical representations remain reusable, but challenge visuals are free to use completely different visual languages: dots, trees, triangles, matchsticks, geometric constructions, or animations.

Do not create a global challenge visual renderer that accumulates shape-specific branches. If several challenges genuinely share the same visual implementation, they can share a small utility later without moving ownership out of the challenge folders.

---

## 18. Future Mathematical Models

The current engine is intentionally strongest around linear relationships.

As the challenge series grows, the model layer can evolve without replacing the challenge architecture.

Potential future model types include:

```text
linear
quadratic
recursive
multiplicative
piecewise
geometric
```

The important distinction is:

> **mathematical model type is an engine concern; challenge type is a content/experience concern.**

For example, a pattern challenge could eventually use a quadratic model without requiring a second kind of Lab.

---

## 19. Development Rules

### Rule 1
A challenge should not duplicate the four representation components.

### Rule 2
Do not put challenge-specific branching into reusable Lab components.

### Rule 3
Use `challengeType` only at the challenge/content layer; never introduce a second discriminator name.

### Rule 4
Keep challenge assets inside the challenge folder.

### Rule 5
Keep mathematical state in `lab-store.ts`.

### Rule 6
Keep pure mathematical calculations in `challenge-types.ts` or a future `math.ts` module.

### Rule 7
Bound every user-controlled rendering quantity.

### Rule 8
When changing challenges, reset both content state and interaction state.

### Rule 9
Prefer configuration over new components.

### Rule 10
The four representations must continue to feel like different windows into the **same mathematical state**. Challenge visuals may provide the starting context, but changes inside the Lab must never mutate the challenge visual or challenge content.

---

## 20. Quality Checklist for Every New Challenge

Before adding a challenge:

- [ ] Does the challenge have a clear mathematical relationship?
- [ ] Can the existing four representations express it meaningfully?
- [ ] Is the challenge defined in its own folder?
- [ ] Is `challengeType` used correctly?
- [ ] Are challenge-specific assets local to the challenge?
- [ ] Are inputs and rendering quantities bounded?
- [ ] Does selecting something in one representation update the others?
- [ ] Does changing the equation update every dependent representation?
- [ ] Does changing challenges reset the previous challenge's state?
- [ ] Are keyboard and screen-reader labels meaningful?
- [ ] Does the TypeScript/build check pass?
- [ ] Has the UI been checked at mobile and desktop widths?

---

## 21. Current Project Map

```text
app/
  page.tsx                 ← application composition
  layout.tsx              ← document shell
  globals.css             ← global styles

challenges/
  _template/              ← copy this to create a challenge
  001-dot-trail/          ← Challenge 1 + its visual
  002-even-steps/         ← Challenge 2 + its visual
  003-odd-steps/          ← Challenge 3 + its visual
  index.ts                ← challenge registry

components/
  ChallengeCard.tsx       ← shared challenge experience shell
  lab/                    ← reusable four-representation engine

lib/
  challenge-types.ts      ← challenge contracts + pure helpers
  lab-store.ts            ← shared interactive mathematical state
  colors.ts               ← representation/equation colors

public/
  (reserved for truly global/static assets)
```

The architecture is deliberately designed so that the **content grows faster than the codebase**.

## Challenge visual and Lab relationship

The challenge visual is independent of the Lab. The original JPG is retained as a reference asset, while the responsive learner-facing visual is rendered by the challenge visual component. It does not change when the learner edits the Number Line, Graph, Algebra Tiles, or Equation.

The Lab representations share Lab state with one another. Each challenge provides the Lab's initial configuration, but after initialization the learner is free to edit the Lab independently.

## Lab navigation

The four representations are presented as tabs. Number Line is the default tab whenever a challenge page is opened or the challenge changes. Tabs are responsive and horizontally scrollable on small screens. Switching tabs changes the visible representation only; it does not reset or alter the shared Lab state.

## Multi-equation comparison

The Equation panel supports up to three simultaneous equations. A learner can add a new relationship or duplicate an existing relationship. Each equation receives a stable visual identity (A, B, C) through the shared color palette.

- Equation text uses the equation's color.
- Graph lines and points use the same color.
- Number-line jumps and output points use the same color.
- Algebra Tiles show the currently active equation and its color identity.
- Hide/Show controls affect only visibility; they do not delete the equation.
- Remove deletes an equation, while keeping at least one equation in the Lab.
- The challenge remains independent: adding or editing equations never changes the challenge image or question.

The Lab's shared state is the only source of truth for the mathematical relationships. The Challenge provides initial state only.

## Challenge architecture

Challenge folders are self-contained. A challenge owns its visual component, visual data/logic, and optional assets. The shared `ChallengeCard` owns the common challenge presentation. Adding a challenge should require creating its folder and registering its challenge in `challenges/index.ts`; shared Lab components should not need challenge-specific rendering branches.
