/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#070A0D',
        'void-2': '#0B1117',
        teal: '#00E5C4',
        'teal-deep': '#0a3b38',
        bone: '#F0EDE6',
        'bone-dim': '#8a8f90',
        crimson: '#C1121F',
        amber: '#E8A33D',
        violet: '#8b7bd8',
      },
      fontFamily: {
        // monumental wide display (the Parallel-Universe silhouette)
        serif: ['Tanker', '"Clash Display"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mega: ['Tanker', '"Clash Display"', 'ui-sans-serif', 'sans-serif'],
        // bold geometric for project names / UI accents
        display: ['"Clash Display"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Satoshi', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.045em',
        tighter: '-0.03em',
      },
      transitionTimingFunction: {
        surgical: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      fontWeight: {
        300: '300',
        400: '400',
        500: '500',
        600: '600',
        700: '700',
        800: '800',
      },
      keyframes: {
        pulse_dot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.7)', opacity: '0.3' },
        },
        drift: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        spin_slow: {
          to: { transform: 'rotate(360deg)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'pulse-dot': 'pulse_dot 1.4s ease-in-out infinite',
        drift: 'drift 4s ease-in-out infinite',
        'spin-slow': 'spin_slow 32s linear infinite',
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
}
