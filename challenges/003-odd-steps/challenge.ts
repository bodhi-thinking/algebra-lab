import OddStepsVisual from "./ChallengeVisual";
import type { PatternChallenge } from "@/lib/challenge-types";

export const challenge: PatternChallenge = {
  challengeType: "pattern",
  id: "odd-steps",
  title: "Odd Steps",
  seriesPosition: 3,
  questionIntro: "Time to think bigger. The rule is steady: +2 squares every step.",
  question:
    "Can you skip ahead and calculate the squares for Step 20?",
  answer: 199,
  hints: [
    {
      id: "h1",
      text: "Look at how many squares are added from one step to the next.",
    },
    {
      id: "h2",
      text: "Two squares are added at every step.",
    },
    {
      id: "h3",
      text: "The pattern is 1, 3, 5, 7, 9, … What comes at Step 100?",
    },
  ],
  tags: [
    { label: "Square pattern", tone: "purple" },
    { label: "Growing by 2", tone: "green" },
  ],
  correctFeedback: "Yes. Step 100 has 199 squares.",
  followUpPrompt:
    "Both patterns grow by 2. So what makes them different?",
  visual: OddStepsVisual,
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
        id: "odd-a",
        label: "A",
        variable: "x",
        outputVariable: "y",
        coefficient: 2,
        constant: -1,
        visible: true,
      },
    ],
    activeEquationId: "odd-a",
    inputStart: 1,
    inputCount: 6,
    selectedInput: null,
    numberLineRange: { min: 0, max: 12 },
  },
};
