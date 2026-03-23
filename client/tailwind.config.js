export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          950: "#050505",
          900: "#0a0a0a",
          800: "#111111",
          700: "#1a1a1a",
        },
        crimson: {
          950: "#1a0000",
          900: "#330000",
          800: "#660000",
          700: "#8b0000",
          600: "#af0000",
          500: "#d40000",
        },
        gold: {
          DEFAULT: "#c5a059",
          muted: "#8c6e3b",
          dark: "#4a3b1f",
        }
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        mono: ["IBM Plex Mono", "monospace"],
        dossier: ["Special Elite", "serif"],
      }
    },
  },
  plugins: [],
}