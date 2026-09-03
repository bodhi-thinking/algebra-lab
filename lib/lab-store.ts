import { create } from "zustand";
import type { Equation, InitialState } from "@/lib/challenge-types";

const MIN_INPUT_COUNT = 1;
const MAX_INPUT_COUNT = 100;
const MAX_EQUATIONS = 3;
const MAX_TERM_VALUE = 100;
const MAX_RANGE_SPAN = 200;
const MIN_RANGE_VALUE = -1000;
const MAX_RANGE_VALUE = 1000;
const INPUT_START_MIN = -100;
const INPUT_START_MAX = 100;
const MIN_DIVISION = 1;
const MAX_DIVISION = 50;

const EQUATION_LABELS = ["A", "B", "C"] as const;

type LabStore = {
  equations: Equation[];
  activeEquationId: string;
  inputStart: number;
  /** Number of jumps; rendered values are inputCount + 1. */
  inputCount: number;
  selectedInput: number | null;
  numberLineRange: { min: number; max: number };
  numberLineDivision: number;
  graphXRange: { min: number; max: number };
  graphXDivision: number;
  loadChallenge: (initialState: InitialState) => void;
  setActiveEquation: (id: string) => void;
  setCubic: (id: string, value: number) => void;
  setQuadratic: (id: string, value: number) => void;
  setCoefficient: (id: string, value: number) => void;
  setConstant: (id: string, value: number) => void;
  setInputStart: (value: number) => void;
  setInputCount: (value: number) => void;
  setSelectedInput: (value: number | null) => void;
  setNumberLineRange: (min: number, max: number) => void;
  setNumberLineDivision: (value: number) => void;
  setGraphXRange: (min: number, max: number) => void;
  setGraphXDivision: (value: number) => void;
  toggleVisibility: (id: string) => void;
  addEquation: () => void;
  duplicateEquation: (id: string) => void;
  removeEquation: (id: string) => void;
};

function finiteNumber(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function clampInteger(
  value: number,
  min: number,
  max: number,
  fallback: number
): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, Math.round(value)));
}

function boundedInteger(value: number, fallback: number): number {
  return clampInteger(value, -MAX_TERM_VALUE, MAX_TERM_VALUE, fallback);
}

function safeEquation(eq: Equation): Equation {
  return {
    ...eq,
    cubic: boundedInteger(eq.cubic ?? 0, 0),
    quadratic: boundedInteger(eq.quadratic ?? 0, 0),
    editableDegree: (eq.editableDegree ?? (eq.cubic ? 3 : eq.quadratic ? 2 : 1)) as 1 | 2 | 3,
    coefficient: boundedInteger(eq.coefficient, 0),
    constant: boundedInteger(eq.constant, 0),
    visible: Boolean(eq.visible),
  };
}

function visibleEquations(equations: Equation[]): Equation[] {
  return equations.filter((eq) => eq.visible);
}

function firstVisibleOrFirst(equations: Equation[]): Equation {
  return visibleEquations(equations)[0] ?? equations[0];
}

function safeDivision(value: number, fallback: number): number {
  return clampInteger(value, MIN_DIVISION, MAX_DIVISION, fallback);
}

function safeRange(min: number, max: number, fallbackMin: number, fallbackMax: number) {
  const nextMin = Math.max(
    MIN_RANGE_VALUE,
    Math.min(MAX_RANGE_VALUE, finiteNumber(min, fallbackMin))
  );
  const nextMax = Math.max(
    MIN_RANGE_VALUE,
    Math.min(MAX_RANGE_VALUE, finiteNumber(max, fallbackMax))
  );

  if (nextMax <= nextMin) {
    return { min: nextMin, max: Math.min(MAX_RANGE_VALUE, nextMin + 1) };
  }

  return {
    min: nextMin,
    max: Math.min(nextMax, nextMin + MAX_RANGE_SPAN),
  };
}

function cloneInitialState(initialState: InitialState): InitialState {
  const sourceEquations = Array.isArray(initialState.equations)
    ? initialState.equations
    : [];

  const equations = sourceEquations
    .slice(0, MAX_EQUATIONS)
    .map(safeEquation);

  const fallback: Equation = {
    id: "eq-a",
    label: "A",
    variable: "x",
    outputVariable: "y",
    cubic: 0,
    quadratic: 0,
    editableDegree: 1,
    coefficient: 1,
    constant: 0,
    visible: true,
  };

  const safeEquations = equations.length ? equations : [fallback];

  if (!visibleEquations(safeEquations).length) {
    safeEquations[0] = { ...safeEquations[0], visible: true };
  }

  const requestedActive = safeEquations.find(
    (equation) => equation.id === initialState.activeEquationId
  );
  const activeEquation =
    requestedActive?.visible
      ? requestedActive
      : firstVisibleOrFirst(safeEquations);

  const inputStart = clampInteger(
    initialState.inputStart,
    INPUT_START_MIN,
    INPUT_START_MAX,
    0
  );

  const inputCount = clampInteger(
    initialState.inputCount,
    MIN_INPUT_COUNT,
    MAX_INPUT_COUNT,
    6
  );

  const numberLineRange = safeRange(
    initialState.numberLineRange?.min,
    initialState.numberLineRange?.max,
    0,
    12
  );

  const graphXRange = safeRange(
    initialState.graphXRange?.min ?? inputStart,
    initialState.graphXRange?.max ?? inputStart + inputCount,
    inputStart,
    inputStart + inputCount
  );

  const lastInput = inputStart + inputCount;
  const selectedInput =
    initialState.selectedInput === null ||
    !Number.isFinite(initialState.selectedInput)
      ? null
      : clampInteger(
          initialState.selectedInput,
          inputStart,
          lastInput,
          inputStart
        );

  return {
    equations: safeEquations,
    activeEquationId: activeEquation.id,
    inputStart,
    inputCount,
    selectedInput,
    numberLineRange,
    numberLineDivision: safeDivision(initialState.numberLineDivision ?? 1, 1),
    graphXRange,
    graphXDivision: safeDivision(initialState.graphXDivision ?? 1, 1),
  };
}

function makeEquationId(label: string): string {
  return `eq-${label.toLowerCase()}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export const useLabStore = create<LabStore>((set) => ({
  equations: [],
  activeEquationId: "",
  inputStart: 0,
  inputCount: 6,
  selectedInput: null,
  numberLineRange: { min: 0, max: 12 },
  numberLineDivision: 1,
  graphXRange: { min: 1, max: 7 },
  graphXDivision: 1,

  loadChallenge: (initialState) => {
    set(cloneInitialState(initialState));
  },

  setActiveEquation: (id) =>
    set((state) => {
      const equation = state.equations.find((eq) => eq.id === id);
      return equation?.visible ? { activeEquationId: id } : state;
    }),

  setCubic: (id, value) =>
    set((state) => ({
      equations: state.equations.map((eq) =>
        eq.id === id
          ? { ...eq, cubic: boundedInteger(value, eq.cubic) }
          : eq
      ),
    })),

  setQuadratic: (id, value) =>
    set((state) => ({
      equations: state.equations.map((eq) =>
        eq.id === id
          ? { ...eq, quadratic: boundedInteger(value, eq.quadratic) }
          : eq
      ),
    })),

  setCoefficient: (id, value) =>
    set((state) => ({
      equations: state.equations.map((eq) =>
        eq.id === id
          ? { ...eq, coefficient: boundedInteger(value, eq.coefficient) }
          : eq
      ),
    })),

  setConstant: (id, value) =>
    set((state) => ({
      equations: state.equations.map((eq) =>
        eq.id === id
          ? { ...eq, constant: boundedInteger(value, eq.constant) }
          : eq
      ),
    })),

  setInputStart: (value) =>
    set((state) => {
      const nextStart = clampInteger(
        value,
        INPUT_START_MIN,
        INPUT_START_MAX,
        state.inputStart
      );
      const lastInput = nextStart + state.inputCount;

      return {
        inputStart: nextStart,
        selectedInput:
          state.selectedInput !== null &&
          state.selectedInput >= nextStart &&
          state.selectedInput <= lastInput
            ? state.selectedInput
            : null,
        graphXRange: {
          min: Math.max(nextStart, state.graphXRange.min),
          max: Math.max(nextStart + 1, state.graphXRange.max),
        },
      };
    }),

  setInputCount: (value) =>
    set((state) => {
      const next = clampInteger(
        value,
        MIN_INPUT_COUNT,
        MAX_INPUT_COUNT,
        state.inputCount
      );
      const lastInput = state.inputStart + next;

      return {
        inputCount: next,
        selectedInput:
          state.selectedInput === null
            ? null
            : Math.min(state.selectedInput, lastInput),
        graphXRange:
          state.graphXRange.max < lastInput
            ? { ...state.graphXRange, max: lastInput }
            : state.graphXRange,
      };
    }),

  setSelectedInput: (value) =>
    set((state) => ({
      selectedInput:
        value === null
          ? null
          : clampInteger(
              value,
              state.inputStart,
              state.inputStart + state.inputCount,
              state.inputStart
            ),
    })),

  setNumberLineRange: (min, max) =>
    set((state) => {
      const range = safeRange(
        min,
        max,
        state.numberLineRange.min,
        state.numberLineRange.max
      );
      return { numberLineRange: range };
    }),

  setNumberLineDivision: (value) =>
    set((state) => ({
      numberLineDivision: safeDivision(value, state.numberLineDivision),
    })),

  setGraphXRange: (min, max) =>
    set((state) => ({
      graphXRange: safeRange(
        min,
        max,
        state.graphXRange.min,
        state.graphXRange.max
      ),
    })),

  setGraphXDivision: (value) =>
    set((state) => ({
      graphXDivision: safeDivision(value, state.graphXDivision),
    })),

  toggleVisibility: (id) =>
    set((state) => {
      const equation = state.equations.find((eq) => eq.id === id);
      if (!equation) return state;

      if (equation.visible && visibleEquations(state.equations).length === 1) {
        return state;
      }

      const equations = state.equations.map((eq) =>
        eq.id === id ? { ...eq, visible: !eq.visible } : eq
      );

      const active = state.equations.find(
        (eq) => eq.id === state.activeEquationId
      );

      if (active?.id === id && equation.visible) {
        return {
          equations,
          activeEquationId: firstVisibleOrFirst(equations).id,
        };
      }

      return { equations };
    }),

  addEquation: () =>
    set((state) => {
      if (state.equations.length >= MAX_EQUATIONS) return state;

      const label = EQUATION_LABELS.find(
        (candidate) =>
          !state.equations.some((eq) => eq.label === candidate)
      );
      if (!label) return state;

      const active = state.equations.find(
        (eq) => eq.id === state.activeEquationId
      );
      const id = makeEquationId(label);
      const equation: Equation = {
        id,
        label,
        variable: "x",
        outputVariable: "y",
        cubic: active?.cubic ?? 0,
        quadratic: active?.quadratic ?? 0,
        editableDegree: active?.editableDegree ?? 1,
        coefficient: active?.coefficient ?? 1,
        constant: active?.constant ?? 0,
        visible: true,
      };

      return {
        equations: [...state.equations, equation],
        activeEquationId: id,
      };
    }),

  duplicateEquation: (id) =>
    set((state) => {
      if (state.equations.length >= MAX_EQUATIONS) return state;

      const source = state.equations.find((eq) => eq.id === id);
      if (!source) return state;

      const label = EQUATION_LABELS.find(
        (candidate) =>
          !state.equations.some((eq) => eq.label === candidate)
      );
      if (!label) return state;

      const newId = makeEquationId(label);
      const duplicate: Equation = {
        ...source,
        id: newId,
        label,
        visible: true,
      };

      return {
        equations: [...state.equations, duplicate],
        activeEquationId: newId,
      };
    }),

  removeEquation: (id) =>
    set((state) => {
      if (state.equations.length <= 1) return state;

      const equations = state.equations.filter((eq) => eq.id !== id);
      if (!equations.length) return state;

      const activeStillExists = equations.some(
        (eq) => eq.id === state.activeEquationId && eq.visible
      );

      return {
        equations,
        activeEquationId: activeStillExists
          ? state.activeEquationId
          : firstVisibleOrFirst(equations).id,
      };
    }),
}));
