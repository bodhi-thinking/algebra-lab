import ChallengeVisual from "./ChallengeVisual";
import type { PatternChallenge } from "@/lib/challenge-types";

export const challenge: PatternChallenge = {
  challengeType: "pattern",
  id: "sides-and-triangles",
  title: "Sides and Triangles",
  seriesPosition: 10,
  questionIntro:
    "The angle sums were growing by 180°. Now look inside the polygons. What is causing that perfectly constant growth? Look inside the shapes. A 3-sided triangle holds 1 triangle. A 4-sided shape holds 2.",
  question:
    "An octagon has 8 sides. If you slice it into triangles from one corner, how many triangles do you get?",
  answer: 6,
  hints: [
    {
      id: "h1",
      text: "Look at the triangle pattern inside the polygons.",
    },
    {
      id: "h2",
      text: "3 sides make 1 triangle, 4 sides make 2 triangles, 5 sides make 3 triangles, and so on.",
    },
    {
      id: "h3",
      text: "The number of triangles is always 2 less than the number of sides.",
    },
  ],
  tags: [
    { label: "Geometry", tone: "purple" },
    { label: "Generalisation", tone: "green" },
  ],
  correctFeedback:
    "Yes. An 8-sided polygon can be divided into 6 triangles from one corner.",
  followUpPrompt:
    "Now connect the two ideas: if every triangle contributes 180°, can you describe the angle sum using the number of sides?",
  visual: ChallengeVisual,
  enabledRepresentations: {
    numberLine: true,
    tiles: false,
    graph: true,
    equation: true,
  },
  allowAddEquation: false,
  initialState: {
    equations: [
      {
        id: "sides-triangles",
        label: "A",
        variable: "x",
        outputVariable: "y",
        cubic: 0,
        quadratic: 0,
        editableDegree: 1,
        coefficient: 1,
        constant: -2,
        visible: true,
      },
    ],
    activeEquationId: "sides-triangles",
    inputStart: 3,
    inputCount: 6,
    selectedInput: null,
    numberLineRange: { min: 0, max: 8 },
  },
};
