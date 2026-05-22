import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        profile: {
          bg: '#0a0a0f',
          surface: '#0d0d14',
          card: '#111118',
          border: 'rgba(255,255,255,0.07)',
          accent: '#c4b5fd',
          'accent-hover': '#d8ccff',
          text: '#e8e6f0',
          'text-muted': 'rgba(255,255,255,0.3)',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(196,181,253,0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(196,181,253,0.4)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
