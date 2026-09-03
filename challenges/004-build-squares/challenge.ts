import BuildSquaresVisual from "./ChallengeVisual";
import type { PatternChallenge } from "@/lib/challenge-types";

export const challenge: PatternChallenge = {
  challengeType: "pattern",
  id: "build-squares",
  title: "Build Squares",
  seriesPosition: 4,
  questionIntro:
    "The odd numbers have a hidden superpower: they build perfect squares! (like how Step 2 uses exactly 4 blocks, Step 3 - 9 blocks)",
  question: "If you keep stacking them, how many blocks will you need for Step 8?",
  answer: 64,
  hints: [
    {
      id: "h1",
      text: "Watch how each odd-number shape is added to the square below.",
    },
    {
      id: "h2",
      text: "1 makes a 1 × 1 square. Add 3 and you get a 2 × 2 square.",
    },
    {
      id: "h3",
      text: "The square sizes are 1 × 1, 2 × 2, 3 × 3, 4 × 4... What happens at Step 8?",
    },
  ],
  correctFeedback:
    "Yes. The odd numbers build larger and larger squares. Step 8 makes a 8 × 8 square, so there are 64 squares.",
  followUpPrompt: "What do you notice about 1, 4, 9, 16, …?",
  tags: [
  { label: "Odd numbers", tone: "purple" },
  { label: "Square pattern", tone: "green" },
],
  visual: BuildSquaresVisual,
  enabledRepresentations: {
    numberLine: true,
    tiles: true,
    graph: true,
    equation: true,
  },
  allowAddEquation: true,
  initialState: {
    equations: [
      {
        id: "square-a",
        label: "A",
        variable: "x",
        outputVariable: "y",
        coefficient: 1,
        constant: 0,
        visible: true,
      },
    ],
    activeEquationId: "square-a",
    inputStart: 1,
    inputCount: 6,
    selectedInput: null,
    numberLineRange: { min: 0, max: 12 },
  },
};
