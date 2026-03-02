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
        bg: 'var(--bg)',
        'bg-2': 'var(--bg-2)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        heading: 'var(--heading)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        'primary-soft': 'var(--primary-soft)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        success: 'var(--success)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        border: 'var(--border)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Menlo', 'Courier New', 'monospace'],
      },
      fontSize: {
        'h1': ['56px', { lineHeight: '1.1', fontWeight: '700' }],
        'h1-mobile': ['40px', { lineHeight: '1.1', fontWeight: '700' }],
        'h2': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2-mobile': ['24px', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        'section': '80px',
        'section-lg': '100px',
        'section-mobile': '48px',
      },
      borderRadius: {
        card: 'var(--radius)',
        button: 'var(--radius-sm)',
      },
      boxShadow: {
        soft: 'var(--shadow-sm)',
        medium: 'var(--shadow-md)',
        default: 'var(--shadow)',
      },
      animation: {
        'fade-in': 'fadeIn var(--duration-slow) ease-out',
        'slide-up': 'slideUp var(--duration-slow) ease-out',
        'fade-in-up': 'fadeInUp var(--duration-slow) ease-out',
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
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
      },
    },
  },
  plugins: [],
}
