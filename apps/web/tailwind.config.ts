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
        terracotta: {
          50: '#FDF0E9',
          100: '#FADFCC',
          200: '#F2BE99',
          300: '#E9986A',
          400: '#E2703A',
          500: '#D15F2B',
          600: '#B84D21',
          700: '#953C19',
        },
        amber: {
          100: '#FCEACB',
          300: '#F2A65A',
          500: '#DB8A33',
        },
        sage: {
          100: '#E4EEE3',
          300: '#A9C9A4',
          500: '#5FA776',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        sans: ['var(--font-jakarta)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        warm: '0 20px 45px -20px rgba(177, 95, 43, 0.35)',
        soft: '0 8px 24px -8px rgba(58, 46, 39, 0.12)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      backgroundImage: {
        'warm-glow':
          'radial-gradient(60% 50% at 15% 10%, rgba(242, 166, 90, 0.35) 0%, rgba(242, 166, 90, 0) 60%), radial-gradient(55% 45% at 90% 15%, rgba(226, 112, 58, 0.25) 0%, rgba(226, 112, 58, 0) 60%)',
      },
    },
  },
  plugins: [],
};

export default config;
