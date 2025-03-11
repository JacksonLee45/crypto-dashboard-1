
// tailwind.config.js
/** @type {import('tailwindcss').Config} */ module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {
          fontFamily: {
            sans: ['var(--font-inter)', 'sans-serif'],
            heading: ['var(--font-poppins)', 'sans-serif'],
            mono: ['var(--font-roboto-mono)', 'monospace'],
          },
        },
      },
      plugins: [],
    }
    