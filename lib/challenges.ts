import type { Challenge } from "./types";

export const challenge01: Challenge = {
  id: "challenge-01",
  level: 1,
  seriesPosition: "Challenge 01 / 40",
  title: "Equal Jumps",
  prompt:
    "Start at 2. Make equal jumps of 3. Where will you land after 5 jumps? Can you predict where you will land after 10 jumps?",
  initialState: {
    equations: [
      {
        id: "eq-a",
        label: "A",
        variable: "x",
        outputVariable: "y",
        coefficient: 3,
        constant: 2,
        visible: true,
        style: "solid",
      },
    ],
    activeEquationId: "eq-a",
    selectedJump: 5,
    jumpCount: 5,
    numberLineRange: { min: -2, max: 20 },
  },
  hints: [
    { id: "h1", text: "Look at what changes each time you jump." },
    { id: "h2", text: "What is the size of each jump?" },
    {
      id: "h3",
      text: "How could you describe the value after any number of jumps — say, jump n?",
    },
  ],
  feedback:
    "You found the constant jump: +3. Starting at 2 means the value is always 2 more than three times the number of jumps.",
  enabledRepresentations: {
    numberLine: true,
    graph: true,
    equation: true,
    tiles: true,
  },
  allowAddEquation: true,
};

export const challenges: Challenge[] = [challenge01];
