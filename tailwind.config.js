module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        textBlack: "#0d0d0d",
        lightGray: "rgba(241, 243, 244, 1)",
        midGray: "rgba(154, 160, 166, 1)",
      },
    },
  },
  plugins: [],
};
