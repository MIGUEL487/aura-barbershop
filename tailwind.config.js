/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0A09',
        foreground: '#F5F4F0',
        card: {
          DEFAULT: '#131210',
          foreground: '#F5F4F0',
        },
        surface: {
          raised: '#1A1916',
        },
        primary: {
          DEFAULT: '#C5A059',
          foreground: '#0B0A09',
          hover: '#D4AF6A',
          deep: '#967432',
        },
        secondary: {
          DEFAULT: '#1A1916',
          foreground: '#F5F4F0',
        },
        muted: {
          DEFAULT: '#1E1D19',
          foreground: '#9E9A90',
        },
        accent: {
          DEFAULT: '#C5A059',
          foreground: '#0B0A09',
        },
        border: 'rgba(245, 244, 240, 0.1)',
        input: 'rgba(245, 244, 240, 0.16)',
        ring: '#C5A059',
      },
      fontFamily: {
        sans: ['Archivo', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Anton', 'Impact', 'sans-serif'],
        pirata: ['"Pirata One"', 'Anton', 'serif'],
      },
      borderRadius: {
        DEFAULT: '0.75rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'marquee': 'marquee 28s linear infinite',
        'marquee-reverse': 'marquee-reverse 28s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
}
