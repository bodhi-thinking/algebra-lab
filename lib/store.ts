"use client";

import { create } from "zustand";
import type { Challenge, EquationModel, LabState } from "./types";

const PALETTE_STYLES: Array<EquationModel["style"]> = [
  "solid",
  "dashed",
  "dotted",
];
const PALETTE_LABELS = ["A", "B", "C"];

type LabStore = LabState & {
  challenge: Challenge | null;
  loadChallenge: (challenge: Challenge) => void;
  setCoefficient: (id: string, value: number) => void;
  setConstant: (id: string, value: number) => void;
  setActiveEquation: (id: string) => void;
  toggleVisibility: (id: string) => void;
  addEquation: () => void;
  removeEquation: (id: string) => void;
  setSelectedJump: (jump: number) => void;
  setJumpCount: (count: number) => void;
  setNumberLineRange: (min: number, max: number) => void;
};

export const useLabStore = create<LabStore>((set, get) => ({
  equations: [],
  activeEquationId: "",
  selectedJump: 5,
  jumpCount: 5,
  numberLineRange: { min: -10, max: 20 },
  challenge: null,

  loadChallenge: (challenge) =>
    set(() => ({
      challenge,
      equations: challenge.initialState.equations,
      activeEquationId: challenge.initialState.activeEquationId,
      selectedJump: challenge.initialState.selectedJump,
      jumpCount: challenge.initialState.jumpCount,
      numberLineRange: challenge.initialState.numberLineRange,
    })),

  setCoefficient: (id, value) =>
    set((s) => ({
      equations: s.equations.map((eq) =>
        eq.id === id ? { ...eq, coefficient: value } : eq
      ),
    })),

  setConstant: (id, value) =>
    set((s) => ({
      equations: s.equations.map((eq) =>
        eq.id === id ? { ...eq, constant: value } : eq
      ),
    })),

  setActiveEquation: (id) => set(() => ({ activeEquationId: id })),

  toggleVisibility: (id) =>
    set((s) => ({
      equations: s.equations.map((eq) =>
        eq.id === id ? { ...eq, visible: !eq.visible } : eq
      ),
    })),

  addEquation: () =>
    set((s) => {
      const nextIndex = s.equations.length;
      const newEq: EquationModel = {
        id: `eq-${Date.now()}`,
        label: PALETTE_LABELS[nextIndex] ?? `E${nextIndex + 1}`,
        variable: "x",
        outputVariable: "y",
        coefficient: 1,
        constant: 0,
        visible: true,
        style: PALETTE_STYLES[nextIndex] ?? "solid",
      };
      return {
        equations: [...s.equations, newEq],
        activeEquationId: newEq.id,
      };
    }),

  removeEquation: (id) =>
    set((s) => {
      const remaining = s.equations.filter((eq) => eq.id !== id);
      const active =
        s.activeEquationId === id
          ? remaining[0]?.id ?? ""
          : s.activeEquationId;
      return { equations: remaining, activeEquationId: active };
    }),

  setSelectedJump: (jump) => set(() => ({ selectedJump: jump })),
  setJumpCount: (count) => set(() => ({ jumpCount: count })),
  setNumberLineRange: (min, max) =>
    set(() => ({ numberLineRange: { min, max } })),
}));

export function getActiveEquation(): EquationModel | undefined {
  const s = useLabStore.getState();
  return s.equations.find((eq) => eq.id === s.activeEquationId);
}
