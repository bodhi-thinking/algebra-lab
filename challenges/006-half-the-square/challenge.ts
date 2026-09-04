import ChallengeVisual from "./ChallengeVisual";
import type { PatternChallenge } from "@/lib/challenge-types";

export const challenge: PatternChallenge = {
  challengeType: "pattern",
  id: "square-halved",
  title: "Half the Square",
  seriesPosition: 6,
  question:
    "Look at the final sequence. If the pattern continues, how many squares will there be at Step 10?",
  answer: 55,
  hints: [
    {
      id: "h1",
      text: "The final sequence begins 1, 3, 6, 10, …",
    },
    {
      id: "h2",
      text: "Look at how much is added each time: +2, +3, +4, …",
    },
    {
      id: "h3",
      text: "Keep adding the next counting number until Step 10.",
    },
  ],
  tags: [
    { label: "Square numbers", tone: "purple" },
    { label: "Growing pattern", tone: "green" },
  ],
  correctFeedback: "Yes. The 10th number in the final sequence is 55.",
  followUpPrompt: "What do you notice about how much is added each time?",
  visual: ChallengeVisual,
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
        id: "square-half-a",
        label: "A",
        variable: "x",
        outputVariable: "y",
        cubic: 0,
        quadratic: 0.5,
        editableDegree: 2,
        coefficient: 0.5,
        constant: 0,
        visible: true,
      },
    ],
    activeEquationId: "square-half-a",
    inputStart: 1,
    inputCount: 4,
    selectedInput: null,
    numberLineRange: { min: 0, max: 12 },
  },
};
