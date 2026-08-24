// Core mathematical model — the single source of truth all four
// representations read from and write to.

export type EquationId = string;

export type EquationModel = {
  id: EquationId;
  label: string; // "A", "B", "C" ...
  variable: string; // "x"
  outputVariable: string; // "y"
  coefficient: number; // m — jump size / growth rate
  constant: number; // b — starting value
  visible: boolean;
  style: "solid" | "dashed" | "dotted";
};

export type NumberLineRange = {
  min: number;
  max: number;
};

export type LabState = {
  equations: EquationModel[];
  activeEquationId: EquationId;
  selectedJump: number; // current x shown as the "landing point"
  jumpCount: number; // how many jumps are drawn on the number line / graph
  numberLineRange: NumberLineRange;
};

export type Hint = {
  id: string;
  text: string;
};

export type EnabledRepresentations = {
  numberLine: boolean;
  graph: boolean;
  equation: boolean;
  tiles: boolean;
};

export type Challenge = {
  id: string;
  level: number;
  seriesPosition: string; // "Challenge 01 / 40" style display value
  title: string;
  prompt: string;
  initialState: LabState;
  hints: Hint[];
  feedback: string; // shown after the learner has explored
  enabledRepresentations: EnabledRepresentations;
  allowAddEquation: boolean;
};

// Derived value at a given jump number, for a single equation.
export function valueAt(eq: EquationModel, jump: number): number {
  return eq.coefficient * jump + eq.constant;
}

// Sequence of landing points from jump 0 to jumpCount (inclusive).
export function jumpSequence(eq: EquationModel, jumpCount: number): number[] {
  const points: number[] = [];
  for (let i = 0; i <= jumpCount; i++) {
    points.push(valueAt(eq, i));
  }
  return points;
}

export function formatEquation(eq: EquationModel): string {
  const { coefficient: m, constant: b, variable, outputVariable } = eq;
  const mPart =
    m === 0
      ? ""
      : m === 1
      ? variable
      : m === -1
      ? `-${variable}`
      : `${m}${variable}`;
  const bPart =
    b === 0 ? "" : b > 0 ? ` + ${b}` : ` - ${Math.abs(b)}`;
  const rhs = mPart ? `${mPart}${bPart || (mPart ? "" : "")}` : `${b}`;
  const body = mPart === "" ? `${b}` : `${mPart}${bPart}`;
  return `${outputVariable} = ${body || "0"}`;
}
