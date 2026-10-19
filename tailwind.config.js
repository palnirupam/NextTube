/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        yt: {
          bg: '#0f0f0f',
          surface: '#181818',
          card: '#1f1f1f',
          hover: '#272727',
          border: '#303030',
          red: '#ff0000',
          redHover: '#cc0000',
          text: '#f1f1f1',
          muted: '#aaaaaa',
          chip: '#272727',
          chipActive: '#f1f1f1',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'YouTube Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
