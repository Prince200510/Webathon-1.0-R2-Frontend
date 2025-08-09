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
        light: {
          background: '#F7F9FC',
          primary: '#4F46E5',
          accent: '#10B981',
          text: '#111827',
          surface: '#FFFFFF',
          border: '#E5E7EB'
        },
        dark: {
          background: '#0F172A',
          primary: '#6366F1',
          accent: '#34D399',
          text: '#F9FAFB',
          surface: '#1E293B',
          border: '#374151'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
