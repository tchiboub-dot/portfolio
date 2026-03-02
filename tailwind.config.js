/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode neutrals
        background: '#F8FAFC',
        surface: '#FFFFFF',
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
        border: '#E2E8F0',
        
        // Dark mode neutrals
        'dark-background': '#0B1220',
        'dark-surface': '#111827',
        'dark-text-primary': '#E5E7EB',
        'dark-text-secondary': '#9CA3AF',
        'dark-border': '#1F2937',
        
        // Primary (bleu pro)
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          soft: '#EFF6FF',
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
        },
        
        // Accent (cyan subtil)
        accent: {
          DEFAULT: '#06B6D4',
          soft: '#ECFEFF',
          50: '#F0FDFA',
          700: '#0891B2',
        },
        
        // Secondaires
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Menlo', 'Courier New', 'monospace'],
      },
      
      fontSize: {
        'h1': ['56px', { lineHeight: '1.1', fontWeight: '800' }],
        'h1-mobile': ['40px', { lineHeight: '1.1', fontWeight: '800' }],
        'h2': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2-mobile': ['24px', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      
      spacing: {
        section: '80px',
        'section-mobile': '48px',
      },
      
      borderRadius: {
        card: '16px',
        'card-lg': '20px',
        button: '8px',
      },
      
      boxShadow: {
        soft: '0 1px 3px rgba(0, 0, 0, 0.08)',
        medium: '0 4px 12px rgba(0, 0, 0, 0.1)',
        light: '0 1px 2px rgba(0, 0, 0, 0.05)',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideUp: {
          'from': { transform: 'translateY(20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeInUp: {
          'from': { transform: 'translateY(30px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      
      transitionDuration: {
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
      },
    },
  },
  plugins: [],
}
