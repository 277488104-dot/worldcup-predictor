import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#1a1a2e',
        accent: '#00d4ff',
        cta: '#ff6b35',
        knockout: '#7c3aed',
        surface: '#16213e',
        'surface-light': '#1f3460',
        muted: '#8892b0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
