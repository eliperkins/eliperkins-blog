import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./posts/**/*.md",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-quattrocento)", "Quattrocento"],
        sans: ["var(--font-raleway)", "Raleway"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
