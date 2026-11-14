/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        police: {
          darkest: '#080D1A',
          dark: '#0F172A',
          card: '#1E293B',
          cardHover: '#283548',
          border: '#334155',
          primary: '#2563EB',
          accent: '#38BDF8',
          success: '#10B981',
          danger: '#EF4444',
          warning: '#F59E0B'
        }
      }
    },
  },
  plugins: [],
}

