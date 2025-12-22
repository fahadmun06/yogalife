import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#764979",
        gary: "#6B6B6B",
        lavender: {
          light: "#E6E1F7",
          DEFAULT: "#C5B4E3",
          dark: "#8B6FC7",
        },
        beige: "#F6EDE4",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)"],
        poppins: ["var(--font-poppins)"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

module.exports = config;
