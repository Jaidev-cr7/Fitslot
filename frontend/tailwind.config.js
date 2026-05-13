/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base backgrounds
        'surface-0': '#09090b',   // page bg (zinc-950)
        'surface-1': '#18181b',   // card bg (zinc-900)
        'surface-2': '#27272a',   // elevated card (zinc-800)
        'border':    '#3f3f46',   // border (zinc-700)
        'border-subtle': '#27272a', // subtle border

        // Text
        'text-primary':   '#fafafa',  // zinc-50
        'text-secondary': '#a1a1aa',  // zinc-400
        'text-muted':     '#71717a',  // zinc-500

        // Accent - subtle emerald
        'accent':         '#10b981',  // emerald-500
        'accent-muted':   '#064e3b',  // emerald-900
        'accent-text':    '#6ee7b7',  // emerald-300

        // Status
        'danger':         '#ef4444',  // red-500
        'danger-muted':   '#450a0a',  // red-950
        'warning':        '#f59e0b',  // amber-500
        'warning-muted':  '#451a03',  // amber-950

        // Legacy aliases (so existing code still works)
        'dark-bg':     '#09090b',
        'dark-card':   '#18181b',
        'dark-border': '#3f3f46',
        'primary':     '#10b981',
        'primary-dark':'#059669',
        'success':     '#10b981',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-accent':  'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
        'gradient-dark':    'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
        'gradient-subtle':  'linear-gradient(135deg, #27272a 0%, #18181b 100%)',
      },
      boxShadow: {
        'glow':        '0 0 20px rgba(16, 185, 129, 0.25)',
        'glow-sm':     '0 0 10px rgba(16, 185, 129, 0.15)',
        'card':        '0 8px 32px rgba(0, 0, 0, 0.5)',
        'card-hover':  '0 16px 48px rgba(0, 0, 0, 0.6)',
        'inset':       'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer':     'shimmer 2s infinite',
        'fade-in':     'fadeIn 0.3s ease-in',
        'slide-up':    'slideUp 0.3s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
