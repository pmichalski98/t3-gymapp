/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primaryCyan': '#00B5E5',
        'lightCyan' : '#46C6EA',
        'darkCyan' : '#008CB3',
        'lightOcean' : '#1F5766',
        'darkOcean' : '#005066',
        'bg' : '#0A233F',
      },
      backgroundColor : {
        'primary': '#0A233F',
      }

    },
  },
  plugins: [],
};

module.exports = config;
