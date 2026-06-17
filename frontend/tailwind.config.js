/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sky Stay Brand Colors (from logo)
        navy: {
          50:  '#eef0f8',
          100: '#d4d9ee',
          200: '#aab3dd',
          300: '#7f8ecb',
          400: '#5568ba',
          500: '#3347a9',
          600: '#253591',
          700: '#1b2b6b', // PRIMARY — logo background
          800: '#131f4e',
          900: '#0b1232',
        },
        gold: {
          50:  '#fdf8ec',
          100: '#f9edc8',
          200: '#f3d98c',
          300: '#ecc04e',
          400: '#c9a84c', // PRIMARY — logo icon color
          500: '#b8922d',
          600: '#9a7521',
          700: '#7a5a18',
          800: '#5b4112',
          900: '#3d2b0b',
        },
        cream: {
          50:  '#faf6ee',
          100: '#f2ebd9',
          200: '#e8dfc8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
