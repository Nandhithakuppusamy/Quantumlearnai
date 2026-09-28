/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* Fluid type scale: interpolates between a compact mobile size at 360px
         and a comfortable desktop size at 1600px. */
      fontSize: {
        '2xs': ['clamp(0.625rem, 0.5978rem + 0.121vw, 0.7188rem)', { lineHeight: '1.45' }],
        xs: ['clamp(0.7813rem, 0.7359rem + 0.2016vw, 0.9375rem)', { lineHeight: '1.5' }],
        sm: ['clamp(0.8438rem, 0.7893rem + 0.2419vw, 1.0313rem)', { lineHeight: '1.55' }],
        base: ['clamp(0.9375rem, 0.8831rem + 0.2419vw, 1.125rem)', { lineHeight: '1.6' }],
        lg: ['clamp(1.0313rem, 0.9677rem + 0.2823vw, 1.25rem)', { lineHeight: '1.5' }],
        xl: ['clamp(1.125rem, 1.0343rem + 0.4032vw, 1.4375rem)', { lineHeight: '1.4' }],
        '2xl': ['clamp(1.25rem, 1.123rem + 0.5645vw, 1.6875rem)', { lineHeight: '1.3' }],
        '3xl': ['clamp(1.5rem, 1.3185rem + 0.8065vw, 2.125rem)', { lineHeight: '1.22' }],
        '4xl': ['clamp(1.75rem, 1.496rem + 1.129vw, 2.625rem)', { lineHeight: '1.15' }],
        '5xl': ['clamp(2.125rem, 1.7984rem + 1.4516vw, 3.25rem)', { lineHeight: '1.1' }],
        '6xl': ['clamp(2.5rem, 2.1008rem + 1.7742vw, 3.875rem)', { lineHeight: '1.05' }],
      },
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
