import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFCF8',
          100: '#FFF8F0',
          200: '#FCEFDE',
          300: '#F5E2C8',
        },
        ink: {
          DEFAULT: '#3A2E27',
          muted: '#8C7B6F',
          faint: '#B8A99B',
        },
        forest: {
          50: '#EEF5F0',
          100: '#DCEBDF',
          200: '#B9D6C0',
          300: '#8FB89A',
          400: '#2F5742',
          500: '#244432',
          600: '#1C3527',
          700: '#142920',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        sans: ['var(--font-jakarta)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        warm: '0 20px 45px -20px rgba(47, 87, 66, 0.35)',
        soft: '0 8px 24px -8px rgba(58, 46, 39, 0.12)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      backgroundImage: {
        'warm-glow':
          'radial-gradient(60% 50% at 15% 10%, rgba(47, 87, 66, 0.18) 0%, rgba(47, 87, 66, 0) 60%), radial-gradient(55% 45% at 90% 15%, rgba(36, 68, 50, 0.14) 0%, rgba(36, 68, 50, 0) 60%)',
      },
    },
  },
  plugins: [],
};

export default config;
