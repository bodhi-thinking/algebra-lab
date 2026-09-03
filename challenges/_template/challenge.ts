import type { PatternChallenge } from "@/lib/challenge-types";
import ChallengeVisual from "./ChallengeVisual";

export const challenge: PatternChallenge = {
  challengeType: "pattern",
  id: "000-example",
  title: "Example Challenge",
  seriesPosition: 0,
  question: "Your challenge question.",
  answer: 0,
  hints: [
    { id: "h1", text: "Your first hint." },
  ],
  tags: [],
  correctFeedback: "Correct.",
  followUpPrompt: "Now explore the idea in the Lab.",
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
        id: "example-a",
        label: "A",
        variable: "x",
        outputVariable: "y",
        cubic: 0,
        quadratic: 0,
        editableDegree: 1,
        coefficient: 1,
        constant: 0,
        visible: true,
      },
    ],
    activeEquationId: "example-a",
    inputStart: 1,
    inputCount: 6,
    selectedInput: null,
    numberLineRange: { min: 0, max: 7 },
  },
};
