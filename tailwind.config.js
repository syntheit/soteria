/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        caveat: ["caveat"],
      },
      height: {
        post: "40rem",
      },
      colors: {
        "sot-bg": "#041C32",
        "sot-2": "#06283D",
        "sot-3": "#064663",
        "sot-focus": "#DA0037",
        hov: "#1a1a1a",
        active: "#787878",
      },
      rounded: {
        post: "20px",
      },
    },
  },
  plugins: [],
};
