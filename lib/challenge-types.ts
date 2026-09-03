import type { ComponentType } from "react";

export type PanelKey = "numberLine" | "tiles" | "graph" | "equation";

export type ChallengeType = "pattern" | "linear";

export type Equation = {
  id: string;
  label: string;
  variable: string;
  outputVariable: string;
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
  question: string;
  questionIntro: string;
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

export function valueAt(eq: Equation, input: number): number {
  return eq.coefficient * input + eq.constant;
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
