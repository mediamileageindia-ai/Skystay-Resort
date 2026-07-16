/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#eef0f8', 100: '#d4d9ee', 200: '#aab3dd', 300: '#7f8ecb',
          400: '#5568ba', 500: '#3347a9', 600: '#253591', 700: '#1b2b6b',
          800: '#131f4e', 900: '#0b1232',
        },
        gold: {
          50:  '#fdf8ec', 100: '#f9edc8', 200: '#f3d98c', 300: '#ecc04e',
          400: '#c9a84c', 500: '#b8922d', 600: '#9a7521', 700: '#7a5a18',
        },
        cream: {
          50: '#faf6ee', 100: '#f2ebd9', 200: '#e8dfc8',
        },
        charcoal: {
          900: '#0d0d0d', 800: '#1a1a1a', 700: '#2a2a2a', 600: '#3a3a3a', 500: '#4a4a4a',
        },
        ivory: {
          50: '#fdfbf6', 100: '#faf8f2', 200: '#f5f0e8', 300: '#f0e6d3',
        },
        forest: {
          900: '#0d1c12', 800: '#162219', 700: '#1c3a2a', 600: '#2d5a3d',
        },
      },
      fontFamily: {
        sans:    ['Poppins', 'PT Sans', 'system-ui', 'sans-serif'],
        serif:   ['PT Sans', 'Georgia', 'serif'],
        display: ['PT Sans', 'Poppins', 'Georgia', 'sans-serif'],
        cinzel:  ['Poppins', 'PT Sans', 'Georgia', 'sans-serif'],
      },
      animation: {
        'fade-in':  'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'shimmer':  'shimmer 1.8s infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity:'0' }, '100%': { opacity:'1' } },
        slideUp: { '0%': { transform:'translateY(24px)', opacity:'0' }, '100%': { transform:'translateY(0)', opacity:'1' } },
        shimmer: { '0%': { backgroundPosition:'-200% 0' }, '100%': { backgroundPosition:'200% 0' } },
      },
    },
  },
  plugins: [],
}
