/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        'neon-blue': '#00c2ff',
        'neon-pink': '#ff00ff',
        'neon-purple': '#9d00ff',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite',
        'fadeIn': 'fadeIn 1s ease-in-out',
        'bounce-custom': 'bounce-custom 2s infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            'box-shadow': '0 0 10px rgba(0, 194, 255, 0.5), 0 0 20px rgba(157, 0, 255, 0.3)',
          },
          '50%': {
            'box-shadow': '0 0 20px rgba(0, 194, 255, 0.8), 0 0 30px rgba(157, 0, 255, 0.6)',
          },
        },
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'bounce-custom': {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-15px)' },
          '60%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
