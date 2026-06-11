import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050510',
        'bg-card': '#0c0c22',
        'bg-elevated': '#111130',
        accent: '#00d4ff',
        'accent-dim': 'rgba(0,212,255,.12)',
        cta: '#ff5722',
        'cta-dim': 'rgba(255,87,34,.12)',
        knockout: '#7c3aed',
        'knockout-dim': 'rgba(124,58,237,.12)',
        success: '#22c55e',
        warning: '#f0c040',
        danger: '#ef4444',
        surface: '#0c0c22',
        'surface-light': '#111130',
        muted: '#64748b',
        'text-secondary': '#94a3b8',
        'text-primary': '#f1f5f9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.5s ease-out infinite',
        'scaleIn': 'scaleIn .5s ease-out',
        'slideUp': 'slideUp .6s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-ring': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,212,255,.2)' },
          '50%': { boxShadow: '0 0 0 8px transparent' },
        },
        scaleIn: { from: { opacity: '0', transform: 'scale(.9)' }, to: { opacity: '1', transform: 'scale(1)' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
      },
    },
  },
  plugins: [],
}
export default config
