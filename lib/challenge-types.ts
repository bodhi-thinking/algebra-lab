import type { ComponentType } from "react";

export type PanelKey = "numberLine" | "tiles" | "graph" | "equation";

export type ChallengeType = "pattern" | "linear";

export type Equation = {
  id: string;
  label: string;
  variable: string;
  outputVariable: string;
  cubic: number;
  quadratic: number;
  /** Highest-order term exposed in the Equation editor (1, 2, or 3). */
  editableDegree: 1 | 2 | 3;
  coefficient: number;
  constant: number;
  visible: boolean;
};

export type LabState = {
  equations: Equation[];
  activeEquationId: string;
  inputStart: number;
  /** Number of jumps. The starting value is not counted as a jump. */
  inputCount: number;
  selectedInput: number | null;
  numberLineRange: { min: number; max: number };
  numberLineDivision?: number;
  graphXRange?: { min: number; max: number };
  graphXDivision?: number;
};

export type InitialState = LabState;

export type Hint = { id: string; text: string };

/** Props supplied to a challenge-owned visual. */
export type ChallengeVisualProps = {
  challenge: Challenge;
};

/**
 * Each challenge owns its visual component. This keeps challenge-specific
 * rendering out of the shared components folder.
 */
export type ChallengeVisualComponent = ComponentType<ChallengeVisualProps>;

export type ChallengeTagTone = "amber" | "purple" | "green" | "blue";

export type ChallengeTag = {
  label: string;
  tone: ChallengeTagTone;
};

export type BaseChallenge = {
  challengeType: ChallengeType;
  id: string;
  title: string;
  seriesPosition: number;
  questionIntro?: string;
  question: string;
  answer: number;
  hints: Hint[];
  correctFeedback: string;
  followUpPrompt: string;
  tags: ChallengeTag[];
  enabledRepresentations: Record<PanelKey, boolean>;
  allowAddEquation: boolean;
  initialState: InitialState;
};

export type PatternChallenge = BaseChallenge & {
  challengeType: "pattern";
  visual: ChallengeVisualComponent;
};

export type LinearChallenge = BaseChallenge & {
  challengeType: "linear";
  successExplanation: string;
};

export type Challenge = PatternChallenge | LinearChallenge;

export function checkAnswer(correct: number, raw: string): boolean {
  if (!Number.isFinite(correct)) return false;

  const value = raw.trim();
  if (!value || value.length > 20) return false;

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed === correct;
}

/** Evaluate the shared polynomial model: y = ax³ + bx² + cx + d. */
export function valueAt(eq: Equation, input: number): number {
  return (
    eq.cubic * input ** 3 +
    eq.quadratic * input ** 2 +
    eq.coefficient * input +
    eq.constant
  );
}

export function sequenceValues(
  eq: Equation,
  start: number,
  count: number
): number[] {
  const safeCount = Number.isFinite(count)
    ? Math.max(0, Math.min(101, Math.floor(count)))
    : 0;
  const safeStart = Number.isFinite(start) ? start : 0;

  return Array.from({ length: safeCount }, (_, i) =>
    valueAt(eq, safeStart + i)
  );
}

/** Highest non-zero polynomial degree currently represented by an equation. */
export function equationDegree(eq: Equation): 0 | 1 | 2 | 3 {
  if (eq.cubic !== 0) return 3;
  if (eq.quadratic !== 0) return 2;
  if (eq.coefficient !== 0) return 1;
  return 0;
}
