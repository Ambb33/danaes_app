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
          light: '#ADD8E6',       // Pastel Light Blue
          DEFAULT: '#5DADE2',     // Medium Blue with better contrast
          dark: '#2874A6',        // Dark Blue for text or accents
        },
        secondary: {
          light: '#FFD1DC',       // Pastel Pink
          DEFAULT: '#FF99B9',     // Medium Pink for buttons
          dark: '#C2185B',        // Dark Pink for text or borders
        },
        accent: {
          light: '#D1FFD1',       // Pastel Mint Green
          DEFAULT: '#88D498',     // Medium Green for buttons
          dark: '#2E8B57',        // Dark Green for text or accents
        },
        background: '#FFF5F5',    // Light Pastel Pink Background
        surface: '#FFFFFF',       // White for surfaces
        error: '#FF7A7A',         // Medium Red for better readability
        success: '#A3D9B7',       // Pastel Green for success
        text: {
          primary: '#1B4F72',     // Dark Blue for high contrast text
          secondary: '#5B2C6F',   // Dark Purple for secondary text
          accent: '#2E7D32',      // Dark Green for accent text
        },
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
