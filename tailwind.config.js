/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#11100F',
        foreground: '#F4F2EC',
        card: {
          DEFAULT: '#181715',
          foreground: '#F4F2EC',
        },
        surface: {
          raised: '#22201D',
        },
        primary: {
          DEFAULT: '#E68A2E',
          foreground: '#14120C',
          deep: '#B85E1A',
        },
        secondary: {
          DEFAULT: '#22201D',
          foreground: '#F4F2EC',
        },
        muted: {
          DEFAULT: '#201E1B',
          foreground: '#B5B0A4',
        },
        accent: {
          DEFAULT: '#E68A2E',
          foreground: '#14120C',
        },
        border: 'rgba(244, 242, 236, 0.14)',
        input: 'rgba(244, 242, 236, 0.22)',
        ring: '#F59E0B',
      },
      fontFamily: {
        sans: ['Archivo', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Pirata One"', 'Anton', 'serif'],
        headline: ['Anton', 'Impact', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.75rem',
        xl: '0.75rem',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
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
