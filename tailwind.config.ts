const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CueTimer Brand Colors
        brand: {
          orange: '#FF6B35',
          yellow: '#FFD23F',
          gray: '#2D3748',
          50: '#fff5ed',
          100: '#ffe7d6',
          200: '#ffceb3',
          300: '#ffb380',
          400: '#ff8c4d',
          500: '#FF6B35', // Primary brand color
          600: '#e55a2b',
          700: '#cc4922',
          800: '#b33819',
          900: '#992710',
        },
        // Secondary brand colors
        success: '#48BB78',
        warning: '#F56565',
        info: '#4299E1',
        // Theme colors
        background: {
          DEFAULT: '#FFFFFF',
          dark: '#1A202C',
        },
        text: {
          primary: '#2D3748',
          secondary: '#4A5568',
          inverse: '#FFFFFF',
        },
        // Keep existing primary for compatibility
        primary: {
          DEFAULT: '#FF6B35',
          50: '#fff5ed',
          100: '#ffe7d6',
          200: '#ffceb3',
          300: '#ffb380',
          400: '#ff8c4d',
          500: '#FF6B35',
          600: '#e55a2b',
          700: '#cc4922',
          800: '#b33819',
          900: '#992710',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        timer: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        brand: '0 4px 14px 0 rgba(255, 107, 53, 0.1)',
        'brand-lg': '0 10px 40px 0 rgba(255, 107, 53, 0.15)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

export default config;
