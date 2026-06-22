/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          400: '#6b8cff',
          500: '#4f6ef7',
          600: '#3a57e8',
        },
        surface: {
          DEFAULT: '#0d1117',
          card:    '#161b27',
          border:  '#21293d',
        },
      },
    },
  },
  plugins: [],
}
