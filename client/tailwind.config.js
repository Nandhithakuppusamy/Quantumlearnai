/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        quantum: {
          950: '#070a12',
          900: '#0b101d',
          850: '#0f172a',
          800: '#141e34',
          750: '#1a2744',
          700: '#223254',
          600: '#324773',
          500: '#466299',
          400: '#6485c4',
          300: '#93aee2',
          200: '#c3d5f3',
          100: '#e5edfa',
        },
        brand: {
          cyan: '#06b6d4',
          violet: '#8b5cf6',
          indigo: '#6366f1',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'quantum-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'quantum-purple': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'quantum-inner': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
