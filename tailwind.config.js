/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Scans all relevant files in 'src/'
    './pages/**/*.{js,ts,jsx,tsx}', // If 'pages' is outside 'src'
    './components/**/*.{js,ts,jsx,tsx}', // If 'components' is outside 'src'
    './app/**/*.{js,ts,jsx,tsx}', // Scans files in the 'app' directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
