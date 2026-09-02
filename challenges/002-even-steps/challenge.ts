import EvenStepsVisual from "./ChallengeVisual";
import type { PatternChallenge } from "@/lib/challenge-types";

export const challenge: PatternChallenge = {
  challengeType: "pattern",
  id: "even-steps",
  title: "Even Steps",
  seriesPosition: 2,
  question:
    "You found the pattern in the last one. Let’s change it up! Can you figure out how many dots there will be at Step 10?",
  answer: 20,
  hints: [
    {
      id: "h1",
      text: "How many dots are added each time?",
    },
    {
      id: "h2",
      text: "This time, 2 dots are added at every step.",
    },
    {
      id: "h3",
      text: "Start with 2 and keep adding 2 until Step 10.",
    },
  ],
  tags: [
    { label: "Dot pattern", tone: "purple" },
    { label: "Growing by 2", tone: "green" },
  ],
  correctFeedback: "Yes. Step 10 has 20 dots.",
  followUpPrompt:
    "Now look at the Number Line and Graph. What do you notice about how the pattern grows?",
  visual: EvenStepsVisual,
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
        id: "even-a",
        label: "A",
        variable: "x",
        outputVariable: "y",
        coefficient: 2,
        constant: 0,
        visible: true,
      },
    ],
    activeEquationId: "even-a",
    inputStart: 1,
    inputCount: 6,
    selectedInput: null,
    numberLineRange: { min: 0, max: 16 },
  },
};
