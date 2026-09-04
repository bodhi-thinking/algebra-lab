import ChallengeVisual from "./ChallengeVisual";
import type { PatternChallenge } from "@/lib/challenge-types";

export const challenge: PatternChallenge = {
  challengeType: "pattern",
  id: "two-border-patterns",
  title: "Same Start, Different Growth",
  seriesPosition: 7,
  questionIntro:
    "Two patterns. One starting point. A different story. Ready to find what makes them different?",
  question:
    "At Figure 5, how many more blocks will Pattern B have than Pattern A?",
  answer: 16,
  hints: [
    {
      id: "h1",
      text: "Count the blocks in Pattern A: 8, 12, 16, … What is being added each time?",
    },
    {
      id: "h2",
      text: "Now count Pattern B: 8, 16, 24, … How much is added each time?",
    },
    {
      id: "h3",
      text: "At Figure 5, Pattern A has 24 blocks and Pattern B has 40 blocks.",
    },
  ],
  tags: [
    { label: "Growing patterns", tone: "green" },
    { label: "Compare", tone: "purple" },
  ],
  correctFeedback:
    "Yes. Pattern A has 24 blocks and Pattern B has 40 blocks at Figure 5, so the difference is 16.",
  followUpPrompt:
    "After each jump, look at the difference in values of A and B - is the change constant, increasing, or decreasing? Use numberline and graph to see the change.",
  visual: ChallengeVisual,
  enabledRepresentations: {
    numberLine: true,
    tiles: true,
    graph: true,
    equation: true,
  },
  allowAddEquation: false,
  initialState: {
    equations: [
      {
        id: "two-patterns-a",
        label: "A",
        variable: "x",
        outputVariable: "y",
        cubic: 0,
        quadratic: 0,
        editableDegree: 1,
        coefficient: 4,
        constant: 4,
        visible: true,
      },
      {
        id: "two-patterns-b",
        label: "B",
        variable: "x",
        outputVariable: "y",
        cubic: 0,
        quadratic: 0,
        editableDegree: 1,
        coefficient: 8,
        constant: 0,
        visible: true,
      },
    ],
    activeEquationId: "two-patterns-a",
    inputStart: 1,
    inputCount: 3,
    selectedInput: null,
    numberLineRange: { min: 0, max: 28 },
  },
};
