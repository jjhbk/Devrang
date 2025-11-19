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
        primary: "var(--primary)",
        "primary-focus": "var(--primary-focus)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        background: "var(--background)",
        "text-main": "var(--text-main)",
        "text-light": "var(--text-light)",
      },
    },
  },
  plugins: [],
};

export default config;
