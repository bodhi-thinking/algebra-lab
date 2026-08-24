import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4F5F0",
        panel: "#FDFDFB",
        ink: "#1D2321",
        "ink-soft": "#5B655E",
        "ink-faint": "#8B948A",
        line: "#DADFD6",
        "line-soft": "#E7EAE2",
        eqA: "#33528F",
        "eqA-soft": "#E4E9F3",
        eqB: "#AE4E30",
        "eqB-soft": "#F4E6E0",
        eqC: "#4C7A56",
        "eqC-soft": "#E4EFE6",
        chalk: "#C6852B",
        "chalk-soft": "#F5E7D2",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-plex-sans)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      borderRadius: {
        sm: "3px",
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(29,35,33,0.04)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(29,35,33,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(29,35,33,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
    },
  },
  plugins: [],
};
export default config;
