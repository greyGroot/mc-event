import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mc: {
          bg: "#0A0A0A",
          dark: "#0A0A0A",
          card: "#121212",
          orange: "#FF5F00",
          red: "#EB001B",
          gold: "#F79E1B",
          amber: "#F79E1B",
        },
      },
      fontFamily: {
        luxury: ["var(--font-geist-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
