import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      colors: {
        fox: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        midnight: {
          50: '#E8E9F1',
          100: '#C5C7D8',
          200: '#9FA3BC',
          300: '#787E9F',
          400: '#5C6388',
          500: '#404771',
          600: '#2E3458',
          700: '#1F2440',
          800: '#13172E',
          900: '#0A0D1F',
          950: '#05070F',
        },
        accent: {
          cyan: '#22D3EE',
          purple: '#A855F7',
          emerald: '#10B981',
          rose: '#F43F5E',
          amber: '#F59E0B',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-grid':
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-32': '32px 32px',
      },
      boxShadow: {
        'glow-fox': '0 0 30px -5px rgba(249, 115, 22, 0.5)',
        'glow-cyan': '0 0 30px -5px rgba(34, 211, 238, 0.5)',
        'glow-purple': '0 0 30px -5px rgba(168, 85, 247, 0.5)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255,255,255,0.05)',
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        gradient: 'gradient 8s ease infinite',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        shimmer: {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', 'box-shadow': '0 0 20px rgba(249,115,22,0.4)' },
          '50%': { opacity: '0.8', 'box-shadow': '0 0 40px rgba(249,115,22,0.7)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
