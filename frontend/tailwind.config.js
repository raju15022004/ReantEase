/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#173c32',
        leaf: '#b7d7c1',
        cream: '#f8f7f4',
        orange: '#e68a51',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 15px 45px rgba(23, 60, 50, 0.08)',
      },
    },
  },
  plugins: [],
}
