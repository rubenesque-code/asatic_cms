/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
// * have taken certain 'extended' colors I've wanted to have an explicit name, such as 'red-warning' from the default color scheme [https://tailwindcss.com/docs/customizing-colors]. Alternatively, could use twin.macro to create tokens.

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false,
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      ["serif-eng"]: ["Lora", "serif"],
      ["serif-tamil"]: ["Noto Serif Tamil", "serif"],
      ["mono"]: ["Noto Sans Mono", "monospace"],
    },
    extend: {
      borderWidth: {
        0.5: "0.5px",
      },
      colors: {
        textBlack: "#0d0d0d",
        lightGray: "rgba(241, 243, 244, 1)",
        midGray: "rgba(154, 160, 166, 1)",
        overlayLight: "rgba(237, 242, 247, 0.2)",
        overlayMid: "rgba(237, 242, 247, 0.6)",
        overlayDark: "rgba(0, 0, 0, 0.65)",
        ["gray-placeholder"]: "#ced4da",
        ["gray-disabled"]: "#94a3b8",
        ["red-warning"]: "#ef4444",
        // text-green-400
        "green-active": "#4ade80",
        "orange-notice": "#fb923c",
        "blue-light-content": "rgb(212, 238, 255)",
        "blue-dark-content": "rgb(13, 115, 168)",
        "gray-content-border": "rgb(73, 71, 70)",
        orange: {
          200: "#fed7aa",
          500: "#f97316",
        },
        articleText: "rgb(73, 71, 70)",
      },
      lineClamp: {
        7: "7",
        8: "8",
        9: "9",
        10: "10",
      },
      spacing: {
        xxxs: ".1rem",
        xxs: ".25rem",
        xs: ".5rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "6rem",
        "2.5xl": "7.5rem",
        "3xl": "9rem",
      },
      gridTemplateColumns: {
        // expand3: 'repeat(3, minmax(max-content, auto))',
        expand5: "repeat(5, minmax(max-content, auto))",
        expand6: "repeat(6, minmax(max-content, auto))",
        expand7: "repeat(7, minmax(max-content, auto))",
        expand8: "repeat(8, minmax(max-content, auto))",
        expand9: "repeat(9, minmax(max-content, auto))",
      },
      typography: {
        DEFAULT: {
          css: {
            width: "65ch",
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
    require("tailwindcss-children"),
  ],
};
