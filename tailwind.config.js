module.exports = {
  content: ["./pages/*.{html,js}", "./index.html", "./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF8C42", // warm-saffron
          50: "#FFF7F0", // warm-saffron-50
          100: "#FFEDD5", // warm-saffron-100
          200: "#FED7AA", // warm-saffron-200
          300: "#FDBA74", // warm-saffron-300
          400: "#FB923C", // warm-saffron-400
          500: "#FF8C42", // warm-saffron-500
          600: "#EA580C", // warm-saffron-600
          700: "#C2410C", // warm-saffron-700
          800: "#9A3412", // warm-saffron-800
          900: "#7C2D12", // warm-saffron-900
        },
        secondary: {
          DEFAULT: "#2E1065", // cosmic-purple
          50: "#F3F0FF", // cosmic-purple-50
          100: "#E9E5FF", // cosmic-purple-100
          200: "#D6CFFF", // cosmic-purple-200
          300: "#B8A9FF", // cosmic-purple-300
          400: "#9B82FF", // cosmic-purple-400
          500: "#7C3AED", // cosmic-purple-500
          600: "#6D28D9", // cosmic-purple-600
          700: "#5B21B6", // cosmic-purple-700
          800: "#4C1D95", // cosmic-purple-800
          900: "#2E1065", // cosmic-purple-900
        },
        accent: {
          DEFAULT: "#FFD700", // pure-gold
          50: "#FFFBEB", // pure-gold-50
          100: "#FEF3C7", // pure-gold-100
          200: "#FDE68A", // pure-gold-200
          300: "#FCD34D", // pure-gold-300
          400: "#FBBF24", // pure-gold-400
          500: "#FFD700", // pure-gold-500
          600: "#D97706", // pure-gold-600
          700: "#B45309", // pure-gold-700
          800: "#92400E", // pure-gold-800
          900: "#78350F", // pure-gold-900
        },
        background: "#0F0B1A", // space-dark
        surface: "#1A1625", // elevated-surface
        text: {
          primary: "#F7F3E9", // warm-off-white
          secondary: "#A69B8C", // muted-warm-gray
        },
        success: {
          DEFAULT: "#4ADE80", // fresh-green
          50: "#ECFDF5", // fresh-green-50
          100: "#D1FAE5", // fresh-green-100
          500: "#4ADE80", // fresh-green-500
          600: "#16A34A", // fresh-green-600
          700: "#15803D", // fresh-green-700
        },
        warning: {
          DEFAULT: "#FBBF24", // warm-amber
          50: "#FFFBEB", // warm-amber-50
          100: "#FEF3C7", // warm-amber-100
          500: "#FBBF24", // warm-amber-500
          600: "#D97706", // warm-amber-600
          700: "#B45309", // warm-amber-700
        },
        error: {
          DEFAULT: "#EF4444", // clear-red
          50: "#FEF2F2", // clear-red-50
          100: "#FEE2E2", // clear-red-100
          500: "#EF4444", // clear-red-500
          600: "#DC2626", // clear-red-600
          700: "#B91C1C", // clear-red-700
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        caption: ['Nunito Sans', 'sans-serif'],
        data: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        nunito: ['Nunito Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'cosmic': '0 8px 16px rgba(255, 140, 66, 0.15)',
        'cosmic-lg': '0 12px 24px rgba(255, 140, 66, 0.15)',
        'cosmic-xl': '0 20px 40px rgba(255, 140, 66, 0.2)',
      },
      borderColor: {
        'cosmic': 'rgba(255, 215, 0, 0.2)',
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
        'cosmic-pulse': 'cosmic-pulse 3s ease-in-out infinite',
        'orbital': 'orbital 20s linear infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        'cosmic-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        orbital: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      transitionTimingFunction: {
        'cosmic': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      backdropBlur: {
        'cosmic': '12px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}