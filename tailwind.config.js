/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          dark: '#0d1b36',
          mid: '#1e3a6e',
        },
        brand: {
          red: '#c0392b',
        },
        surface: {
          light: '#f4f6fa',
          border: '#e0e6f0',
        },
      },
    },
  },
  plugins: [],
}
