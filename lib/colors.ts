export type EquationColorKey = "A" | "B" | "C";

type ColorSet = {
  stroke: string; // hex for SVG stroke/fill
  text: string; // tailwind text class
  bg: string; // tailwind bg class (soft)
  ring: string; // tailwind ring/border class
  dash: string | undefined; // SVG stroke-dasharray
};

const COLORS: Record<EquationColorKey, ColorSet> = {
  A: {
    stroke: "#33528F",
    text: "text-eqA",
    bg: "bg-eqA-soft",
    ring: "border-eqA",
    dash: undefined,
  },
  B: {
    stroke: "#AE4E30",
    text: "text-eqB",
    bg: "bg-eqB-soft",
    ring: "border-eqB",
    dash: "6 4",
  },
  C: {
    stroke: "#4C7A56",
    text: "text-eqC",
    bg: "bg-eqC-soft",
    ring: "border-eqC",
    dash: "1.5 4",
  },
};

export function colorFor(label: string): ColorSet {
  const key = (["A", "B", "C"].includes(label) ? label : "A") as EquationColorKey;
  return COLORS[key];
}
