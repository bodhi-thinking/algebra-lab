import ChallengeVisual from "./ChallengeVisual";
import type { PatternChallenge } from "@/lib/challenge-types";

export const challenge: PatternChallenge = {
  challengeType: "pattern",
  id: "growing-gap",
  title: "The Growing Gap",
  seriesPosition: 8,
  questionIntro:
    "Two patterns are growing. And so is the space between them.",
  question:
    "Check the number line and graph below. Follow the gap between Pattern A and Pattern B as you move from one figure to the next. At what rate is the gap growing?",
  answer: 4,
  hints: [
    {
      id: "h1",
      text: "Find the difference between Pattern B and Pattern A at each figure.",
    },
    {
      id: "h2",
      text: "The gaps begin 0, 4, 8, 12, … What is changing from one gap to the next?",
    },
    {
      id: "h3",
      text: "The gap increases by 4 blocks each time.",
    },
  ],
  tags: [
    { label: "Rate of change", tone: "green" },
    { label: "Compare", tone: "purple" },
  ],
  correctFeedback:
    "Yes. The gap grows by 4 blocks for every one-figure increase.",
  followUpPrompt:
    "Now change the lens. Can you find that same 4 in the patterns above? Try writing a rule for how each pattern grows. Then change Pattern B so that it grows by 4 instead of 8. What happens? Will Patterns A and B become the same?",
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
        id: "growing-gap-a",
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
        id: "growing-gap-b",
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
    activeEquationId: "growing-gap-a",
    inputStart: 1,
    inputCount: 5,
    selectedInput: null,
    numberLineRange: { min: 0, max: 44 },
  },
};
