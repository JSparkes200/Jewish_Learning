import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: "#f5ecd8",
          deep: "#e8dcc4",
          card: "#faf3e6",
        },
        ink: {
          DEFAULT: "#2c2416",
          muted: "#5c4f3d",
          faint: "#8a7a62",
        },
        sage: { DEFAULT: "#4a6830", light: "#5d7d3f" },
        rust: "#8b3a1a",
        burg: "#6a1828",
        amber: "#c87020",
      },
      fontFamily: {
        hebrew: ["var(--font-hebrew)", "serif"],
        label: ["var(--font-ui)", "system-ui", "sans-serif"],
        body: ["var(--font-ui)", "Georgia", "serif"],
      },
      boxShadow: {
        elevated:
          "6px 8px 22px rgba(44, 36, 22, 0.12), -2px -2px 10px rgba(245, 236, 216, 0.45)",
        "elevated-lg":
          "10px 12px 32px rgba(44, 36, 22, 0.14), -2px -2px 12px rgba(245, 236, 216, 0.5)",
        insetSoft:
          "inset 3px 3px 8px rgba(44, 36, 22, 0.1), inset -2px -2px 6px rgba(255, 255, 255, 0.45)",
      },
      keyframes: {
        glassShine: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(320%)" },
        },
      },
      animation: {
        "glass-shine": "glassShine 3.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
