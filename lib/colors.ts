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

  D: {
    stroke: "#9A78E8",
    bg: "bg-[#F0EBFF]",
    text: "text-[#6E4FC2]",
    ring: "border-[#C9B8F5]",
    dash: "9 4",
  },

  E: {
    stroke: "#D08A2E",
    bg: "bg-[#FFF3DE]",
    text: "text-[#A86D18]",
    ring: "border-[#E8C58F]",
    dash: "3 3",
  },

  F: {
    stroke: "#C45A8A",
    bg: "bg-[#FBEAF2]",
    text: "text-[#A33F6D]",
    ring: "border-[#E5A9C5]",
    dash: "10 3 2 3",
  },
};

export function colorFor(label: string): EquationColor {
  return COLORS[label] ?? COLORS.A;
}