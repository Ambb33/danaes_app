/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4169E1',       // Royal Blue
          DEFAULT: '#0000FF',     // Blue
          dark: '#00008B',        // Dark Blue
        },
        secondary: {
          light: '#FFB7C5',       // Light Pink
          DEFAULT: '#FF69B4',     // Hot Pink
          dark: '#D85692',        // Medium Pink
        },
        accent: {
          light: '#C3F0CA',       // Light Mint Green
          DEFAULT: '#32CD32',     // Lime Green
          dark: '#2BA12B',        // Medium Green
        },
        background: '#F0F8FF',    // Alice Blue
        surface: '#FFFFFF',       // White surface
        error: '#FF4C4C',         // Bright Red for errors
        success: '#4BB543',       // Emerald Green for success messages
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
