/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#131921', light: '#232f3e' },
        accent: { DEFAULT: '#febd69', hover: '#f3a847' },
        cta: { DEFAULT: '#ff9900', hover: '#e88b00' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
