import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ✅ Use CSS variable syntax that works with opacity utilities
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "primary-focus": "rgb(var(--color-primary-focus) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        "text-main": "rgb(var(--color-text-main) / <alpha-value>)",
        "text-light": "rgb(var(--color-text-light) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};

export default config;
