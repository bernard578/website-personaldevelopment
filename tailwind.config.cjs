/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ─── your existing entries ─── */
        border: 'oklch(var(--border) / <alpha-value>)',
        ring:   'oklch(var(--ring)   / <alpha-value>)',

        primary:            '#6a5bf8',
        primaryForeground:  '#ffffff',         // keep white    

        /* ─── NEW: the tokens you @apply ─── */
        background: 'oklch(var(--background) / <alpha-value>)',
        foreground: 'oklch(var(--foreground) / <alpha-value>)',

        /* (Add any others you’ll reference: card, accent, etc.) */
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
