export type EquationColor = {
  stroke: string;
  bg: string;
  text: string;
  ring: string;
  dash?: string;
};

// A small, high-contrast palette inspired by graphing tools such as GeoGebra.
// Keep the palette stable so an equation keeps the same identity across every representation.
const COLORS: Record<string, EquationColor> = {
  A: {
    stroke: "#2F6FED",
    bg: "bg-eqA-soft",
    text: "text-eqA",
    ring: "border-eqA",
  },
  B: {
    stroke: "#E34B4B",
    bg: "bg-eqB-soft",
    text: "text-eqB",
    ring: "border-eqB",
    dash: "7 4",
  },
  C: {
    stroke: "#2E9B62",
    bg: "bg-eqC-soft",
    text: "text-eqC",
    ring: "border-eqC",
    dash: "2 4",
  },
};

export function colorFor(label: string): EquationColor {
  return COLORS[label] ?? COLORS.A;
}
