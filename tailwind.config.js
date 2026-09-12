/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#000000',
          900: '#08090C',
          850: '#0D0E12',
          800: '#14151B',
          700: '#1C1E26',
          600: '#2A2D39',
        },
        tr: {
          green: '#00D06C',
          greenBuy: '#82B837',
          greenGlow: 'rgba(0, 208, 108, 0.2)',
          red: '#FF3B30',
          redGlow: 'rgba(255, 59, 48, 0.2)',
          gray: '#8E8E93',
          muted: '#66666A',
          card: 'rgba(255, 255, 255, 0.03)',
          cardHover: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHighlight: 'rgba(255, 255, 255, 0.14)',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'Inter',
          'system-ui',
          'sans-serif'
        ],
        mono: ['"SF Mono"', 'ui-monospace', 'Menlo', 'monospace']
      },
      boxShadow: {
        'glow-green': '0 0 20px -3px rgba(0, 200, 5, 0.3)',
        'glow-red': '0 0 20px -3px rgba(255, 59, 48, 0.3)',
        'card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
}
