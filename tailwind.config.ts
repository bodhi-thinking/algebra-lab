import type { Config } from "tailwindcss";

const config: Config = {
  content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./lib/**/*.{ts,tsx}",
        "./challenges/**/*.{ts,tsx}",
      ],
  theme: {
    extend: {
      colors: {
        paper: "#F7F7FB",
        panel: "#FFFFFF",
        ink: "#1F2430",
        "ink-soft": "#5B6472",
        "ink-faint": "#9AA3B2",
        line: "#E4E7EF",
        "line-soft": "#EFF1F7",
        eqA: "#2F6FED",
        "eqA-soft": "#E8F0FF",
        eqB: "#E34B4B",
        "eqB-soft": "#FDEAEA",
        eqC: "#2E9B62",
        "eqC-soft": "#E5F6EC",
        chalk: "#E0972B",
        "chalk-soft": "#FBEAD1",
        primary: { DEFAULT: "#7C5CFC", soft: "#EDE9FE" },
        secondary: { DEFAULT: "#10B981", soft: "#ECFDF5" },
      },
      fontFamily: {
        display: ["var(--font-baloo)", "sans-serif"],
        body: ["var(--font-plex-sans)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      boxShadow: { panel: "0 1px 2px 0 rgba(31,36,48,0.06)" },
    },
  },
  plugins: [],
};
export default config;
