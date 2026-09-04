import OddDifferencesVisual from "./ChallengeVisual";
import type { PatternChallenge } from "@/lib/challenge-types";

export const challenge: PatternChallenge = {
  challengeType: "pattern",
  id: "odd-differences",
  title: "The Odd Difference",
  seriesPosition: 5,
  questionIntro:
    "Just to let the math sink in.. Notice the surprising connection: 100 - 81 = 19, exactly the 10th odd number.Similarly, 64 - 49 = 15 - 8th odd number. ",
  question:
     "Can you use this rule to predict the difference between the 20th and 19th square numbers without calculating the squares?",
  answer: 39,
  hints: [
    {
      id: "h1",
      text: "The 19th square number is 361 and the 20th square number is 400.",
    },
    {
      id: "h2",
      text: "What is the 20th odd number?",
    },
    {
      id: "h3",
      text: "400 - 361 = 20th odd number?",
    },
  ],
  tags: [
    { label: "Odd numbers", tone: "purple" },
    { label: "Square numbers", tone: "green" },
  ],
  correctFeedback:
    "Yes. 400 - 361 = 39. Now look back at the odd-number pattern.",
  followUpPrompt: "Where do you find 39 in the odd-number pattern?",
  visual: OddDifferencesVisual,
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
        cubic: 0,
        quadratic: 0,
        editableDegree: 1,
        coefficient: 2,
        constant: -1,
        visible: true,
      },
      {
        id: "square-b",
        label: "B",
        variable: "x",
        outputVariable: "y",
        cubic: 0,
        quadratic: 1,
        editableDegree: 2,
        coefficient: 0,
        constant: 0,
        visible: true,
      },
    ],
    activeEquationId: "square-b",
    inputStart: 1,
    inputCount: 11,
    selectedInput: null,
    numberLineRange: { min: 0, max: 25 },
    numberLineDivision: 5,
    graphXRange: { min: 1, max: 12 },
    graphXDivision: 1,
  },
};
