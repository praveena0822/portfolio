/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'] },
      colors: {
        brand: { DEFAULT: '#0A66C2', dark: '#004182', light: '#70B5F9' },
        page: { DEFAULT: '#F3F2EF', dark: '#0F1113' },
        surface: { dark: '#1B1F23' },
        line: { DEFAULT: '#E0DFDC', dark: '#38434F' },
        ink: { DEFAULT: '#191919', dark: '#E9E9E7' },
        muted: { DEFAULT: '#5E5E5E', dark: '#A7ADB4' },
      },
    },
  },
  plugins: [],
};
