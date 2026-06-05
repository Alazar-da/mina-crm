// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // ← ADD THIS
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors - Mina Technologies
        'mina': {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',  // Primary brand color
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // Secondary Accent Colors
        'coral': {
          50: '#fff1f0',
          100: '#ffe0de',
          200: '#ffc6c2',
          300: '#ff9e97',
          400: '#ff6b61',
          500: '#f44336',  // Coral accent
          600: '#e31b0c',
          700: '#c91405',
          800: '#a61206',
          900: '#8b1408',
          950: '#4a0600',
        },
        'teal': {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',  // Teal accent
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        'amber': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // Amber accent
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Neutral Colors for Light Mode
        'light': {
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          text: '#0f172a',
          textSecondary: '#64748b',
        },
        // Neutral Colors for Dark Mode
        'dark': {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          text: '#f1f5f9',
          textSecondary: '#94a3b8',
        },
        // Status Colors
        'status': {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
          neutral: '#6b7280',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f44336 0%, #f97316 50%, #f59e0b 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #2e1065 100%)',
      },
      boxShadow: {
        'primary': '0 4px 14px 0 rgba(99, 102, 241, 0.25)',
        'primary-lg': '0 10px 25px -5px rgba(99, 102, 241, 0.3)',
        'coral': '0 4px 14px 0 rgba(244, 67, 54, 0.25)',
        'teal': '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
        'dark': '0 4px 14px 0 rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'gradient': 'gradient 3s ease infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
      },
    },
  },
  plugins: [],
}