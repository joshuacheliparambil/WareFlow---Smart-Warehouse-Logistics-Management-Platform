/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101318",
        panel: "#171b22",
        line: "#2a303a",
        mint: "#4fd1a5",
        amber: "#f7b955",
        coral: "#f97373",
        sky: "#5ab2ff"
      }
    }
  },
  plugins: []
};
