const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modulos/**/*.{js,ts,jsx,tsx,mdx}',
    './src/compartido/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Identidad monocroma: negro, blanco y derivados (escala "tinta").
      colors: {
        tinta: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
      },
      fontFamily: {
        sans: ['var(--fuente-sans)', ...fontFamily.sans],
      },
      boxShadow: {
        suave: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)',
      },
    },
  },
  plugins: [],
};
