// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
   
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
   // tailwind.config.js

extend: {
  colors: {
    primary: {
      light: '#FFECB3',       // Light amber
      DEFAULT: '#FFC107',     // Amber
      dark: '#FFA000',        // Dark amber
    },
    secondary: {
      light: '#B3E5FC',       // Light cyan
      DEFAULT: '#03A9F4',     // Cyan
      dark: '#0288D1',        // Dark cyan
    },
    accent: {
      light: '#DCEDC8',       // Light green
      DEFAULT: '#8BC34A',     // Green
      dark: '#689F38',        // Dark green
    },
    background: '#FFFDE7',    // Light yellow background
    surface: '#FFFFFF',       // White surface
    error: '#F44336',         // Red for errors
    success: '#4CAF50',       // Green for success messages
  },
      keyframes: {
        correct: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
        },
        incorrect: {
          '0%': { transform: 'translateX(0px)' },
          '10%': { transform: 'translateX(-10px)' },
          '20%': { transform: 'translateX(10px)' },
          '30%': { transform: 'translateX(-10px)' },
          '40%': { transform: 'translateX(10px)' },
          '50%': { transform: 'translateX(-10px)' },
          '60%': { transform: 'translateX(10px)' },
          '70%': { transform: 'translateX(-10px)' },
          '80%': { transform: 'translateX(10px)' },
          '90%': { transform: 'translateX(-10px)' },
          '100%': { transform: 'translateX(0px)' },
        },
      },
      animation: {
        correct: 'correct 0.5s ease-in-out',
        incorrect: 'incorrect 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
};
