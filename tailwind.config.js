/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0E0D0C',
        foreground: '#F5F4F0',
        card: {
          DEFAULT: '#171513',
          foreground: '#F5F4F0',
        },
        surface: {
          raised: '#221E1A',
        },
        primary: {
          DEFAULT: '#FF6E00',
          foreground: '#0E0D0C',
          deep: '#D95800',
        },
        secondary: {
          DEFAULT: '#221E1A',
          foreground: '#F5F4F0',
        },
        muted: {
          DEFAULT: '#1F1C18',
          foreground: '#A8A39B',
        },
        accent: {
          DEFAULT: '#FF6E00',
          foreground: '#0E0D0C',
        },
        border: 'rgba(245, 244, 240, 0.12)',
        input: 'rgba(245, 244, 240, 0.2)',
        ring: '#FF6E00',
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
        'marquee': 'marquee 22s linear infinite',
        'marquee-reverse': 'marquee-reverse 22s linear infinite',
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
