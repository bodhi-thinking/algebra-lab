import DotTrailVisual from "./ChallengeVisual";
import type { PatternChallenge } from "@/lib/challenge-types";

export const challenge: PatternChallenge = {
  challengeType: "pattern",
  id: "dot-trail",
  title: "The Dot Trail",
  seriesPosition: 1,
  questionIntro: "Let’s warm up those brain cells! This one’s an easy starter:",
  question: "If the pattern continues, how many dots will there be at Step 10?",
  answer: 10,
  hints: [
    { id: "h1", text: "Look at what changes from one step to the next." },
    { id: "h2", text: "Count the dots: 1, 2, 3, 4, 5, 6… What is being added each time?" },
    { id: "h3", text: "The step number and the number of dots are connected. Test that idea for Step 10." },
  ],
  tags: [
    { label: "Dot pattern", tone: "purple" },
    { label: "Pattern explorer", tone: "green" },
  ],
  correctFeedback: "Yes. Step 10 has 10 dots.",
  followUpPrompt: "Now look at the Number Line and Graph. What do you notice about the relationship?",
  visual: DotTrailVisual,
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
        id: "pattern-a",
        label: "A",
        variable: "x",
        outputVariable: "y",
        coefficient: 1,
        constant: 0,
        visible: true,
      },
    ],
    activeEquationId: "pattern-a",
    inputStart: 1,
    inputCount: 6,
    selectedInput: null,
    numberLineRange: { min: 0, max: 7 },
  },
};
