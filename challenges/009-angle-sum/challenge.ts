import ChallengeVisual from "./ChallengeVisual";
import type { PatternChallenge } from "@/lib/challenge-types";

export const challenge: PatternChallenge = {
  challengeType: "pattern",
  id: "angle-sum",
  title: "How Is the Angle Sum Growing?",
  seriesPosition: 9,
  questionIntro: "Polygons have a hidden pattern. Look closely at the angle sums as the shapes grow: Every time a new side is added, the internal space expands by the exact same mathematical rhythm.",
  question: "If this constant growth continues, what is the sum of the interior angles of an 8-sided octagon?",
  answer: 1080,
  hints: [
    { id: "h1", text: "Look at the angle sums for the triangle, quadrilateral, pentagon, and so on." },
    { id: "h2", text: "180°, 360°, 540°, 720°, … How much is added each time?" },
    { id: "h3", text: "The angle sum grows by 180° each time. An octagon is the next step after a heptagon." },
  ],
  tags: [
    { label: "Growth", tone: "green" },
    { label: "Geometry", tone: "purple" },
  ],
  correctFeedback: "Yes. The interior-angle sum of an octagon is 1080°.",
  followUpPrompt: "Now look inside the polygons. Can you find a relationship between the number of sides and the number of triangles?",
  visual: ChallengeVisual,
  enabledRepresentations: { numberLine: true, tiles: false, graph: true, equation: true },
  allowAddEquation: false,
  initialState: {
    equations: [{ id: "angle-sum", label: "A", variable: "x", outputVariable: "y", cubic: 0, quadratic: 0, editableDegree: 1, coefficient: 180, constant: -360, visible: true }],
    activeEquationId: "angle-sum",
    inputStart: 3,
    inputCount: 6,
    selectedInput: null,
    numberLineRange: { min: 0, max: 1200 },
  },
};
