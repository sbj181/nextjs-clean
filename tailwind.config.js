module.exports = {
  darkMode: 'class',  
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.css"
  ],
  theme: {
    extend: {
      boxShadow: {
        'flat-2d': '-2px 2px 0px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}
