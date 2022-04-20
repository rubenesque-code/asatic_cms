/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false,
  theme: {
    fontFamily: {
      sans: ['"Inter"', "sans-serif"],
    },
    extend: {
      colors: {
        textBlack: "#0d0d0d",
        lightGray: "rgba(241, 243, 244, 1)",
        midGray: "rgba(154, 160, 166, 1)",
        overlayLight: "rgba(237, 242, 247, 0.5)",
      },
      spacing: {
        xxs: ".25rem",
        xs: ".5rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        xxl: "6rem",
      },
      gridTemplateColumns: {
        // expand3: 'repeat(3, minmax(max-content, auto))',
        expand5: "repeat(5, minmax(max-content, auto))",
      },
    },
  },
  plugins: [],
};
