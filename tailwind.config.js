/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0E0D0B',
        foreground: '#F5F2EB',
        card: {
          DEFAULT: '#151311',
          foreground: '#F5F2EB',
        },
        surface: {
          raised: '#1C1916',
        },
        primary: {
          DEFAULT: '#B89A5C',
          foreground: '#0E0D0B',
          hover: '#CDB173',
          deep: '#8A713E',
        },
        secondary: {
          DEFAULT: '#1C1916',
          foreground: '#F5F2EB',
        },
        muted: {
          DEFAULT: '#221E1A',
          foreground: '#9E988D',
        },
        accent: {
          DEFAULT: '#D8C6A5',
          foreground: '#0E0D0B',
        },
        border: 'rgba(245, 242, 235, 0.1)',
        input: 'rgba(245, 242, 235, 0.16)',
        ring: '#B89A5C',
      },
      fontFamily: {
        sans: ['Archivo', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', 'Anton', 'Georgia', 'serif'],
        pirata: ['"Pirata One"', 'serif'],
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
