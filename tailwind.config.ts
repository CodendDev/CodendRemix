import type { Config } from "tailwindcss";

const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        better_green: "#4dcb7a",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
