/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'prime': {
          'blue': '#00A8E1',
          'dark': '#0F171E',
          'darker': '#0A0E13',
          'gray': '#1A242F',
          'light-gray': '#232F3E',
          'border': '#37475A',
          'text': '#FFFFFF',
          'text-secondary': '#AAAAAA',
          'text-muted': '#6B7280',
          'accent': '#FF9900',
          'accent-hover': '#E6870A',
          'success': '#00D4AA',
          'warning': '#FFB020',
          'error': '#FF4757',
          'dimple': '#232F3E',
        },
      },
      fontFamily: {
        'sans': ['Amazon Ember', 'Inter', 'system-ui', 'sans-serif'],
        'display': ['Amazon Ember', 'Inter', 'system-ui', 'sans-serif'],
        'prime': ['Amazon Ember', 'sans-serif'],
      },
      fontSize: {
        'prime-xs': ['0.75rem', { lineHeight: '1rem' }],
        'prime-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'prime-base': ['1rem', { lineHeight: '1.5rem' }],
        'prime-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'prime-xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'prime-2xl': ['1.5rem', { lineHeight: '2rem' }],
        'prime-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        'prime-4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      animation: {
        'prime-fade-in': 'primeFadeIn 0.8s ease-out',
        'prime-slide-in': 'primeSlideIn 0.6s ease-out',
        'prime-glow': 'primeGlow 2s ease-in-out infinite',
        'prime-bounce': 'primeBounce 1s ease-in-out infinite',
        'prime-pulse': 'primePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        primeFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        primeSlideIn: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        primeGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 168, 225, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 168, 225, 0.6)' },
        },
        primeBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        primePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      backdropBlur: {
        'prime': '12px',
      },
      boxShadow: {
        'prime': '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        'prime-lg': '0 35px 60px -12px rgba(0, 0, 0, 0.7)',
        'prime-blue': '0 10px 25px rgba(0, 168, 225, 0.3)',
        'prime-accent': '0 10px 25px rgba(255, 153, 0, 0.3)',
      },
      borderRadius: {
        'prime': '12px',
        'prime-lg': '16px',
      },
      spacing: {
        'prime-xs': '0.25rem',
        'prime-sm': '0.5rem',
        'prime-md': '1rem',
        'prime-lg': '1.5rem',
        'prime-xl': '2rem',
        'prime-2xl': '3rem',
      },
    },
  },
  plugins: [],
}