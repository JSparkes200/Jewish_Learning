import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
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
    },
  },
  plugins: [],
};

export default config;
