/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        abdm: {
          navy: '#00274C',
          blue: '#0056B3',
          darkblue: '#003366',
          saffron: '#FF9933',
          green: '#138808',
          bg: '#F4F7FA',
          border: '#CBD5E1',
          gold: '#B45309',
          alert: '#B91C1C'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

