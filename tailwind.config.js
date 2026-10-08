/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#06080A',
        'void-2': '#0C1116',
        teal: '#00E5C4',
        'teal-deep': '#0a3b38',
        bone: '#ECE6DA',
        'bone-dim': '#8f9294',
        crimson: '#E0303A',
        amber: '#E8A33D',
        violet: '#8b7bd8',
        brass: '#C9A46A',
      },
      fontFamily: {
        // wide extended display — the Parallel Universe silhouette (they use
        // Bounded; Unbounded is its open-source sibling)
        serif: ['"Unbounded Variable"', 'Unbounded', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mega: ['"Unbounded Variable"', 'Unbounded', 'ui-sans-serif', 'sans-serif'],
        display: ['"Unbounded Variable"', 'Unbounded', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // instrument labels — the Active Theory register (they use NB Architekt)
        mono: ['"Martian Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
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
        sheen: {
          '0%': { backgroundPosition: '180% 0' },
          '60%, 100%': { backgroundPosition: '-80% 0' },
        },
        dashflow: {
          to: { strokeDashoffset: '-16' },
        },
        countup: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-dot': 'pulse_dot 1.4s ease-in-out infinite',
        drift: 'drift 4s ease-in-out infinite',
        'spin-slow': 'spin_slow 32s linear infinite',
        marquee: 'marquee 28s linear infinite',
        sheen: 'sheen 7s ease-in-out infinite',
        dashflow: 'dashflow .9s linear infinite',
      },
    },
  },
  plugins: [],
}
