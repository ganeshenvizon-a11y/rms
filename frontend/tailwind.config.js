/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#B91C1C',
          dark: '#991B1B',
          light: '#FEE2E2',
          hover: '#A11818',
        },
        accent: {
          DEFAULT: '#FACC15',
          hover: '#EAB308',
          light: '#FEF9C3',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          card: '#FFFFFF',
          muted: '#F5F5F4',
        },
        bg: {
          DEFAULT: '#FAFAF9',
          alt: '#F3F4F6',
        },
        mainText: '#111111',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      fontFamily: {
        serif: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(17, 17, 17, 0.05)',
        'floating': '0 10px 30px -4px rgba(185, 28, 28, 0.2)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
