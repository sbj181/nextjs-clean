module.exports = {
  darkMode: 'class',  
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.css"
  ],
  theme: {
    extend: {
      colors: {
        'custom-black': '#17161D',
        'custom-black-dark': '#0f0e12',
        'custom-white': '#fdfeff',
        'custom-white-dark': '#d9dbde',
        'custom-teal': '#00DFC3',
        'custom-teal-dark': '#00b39c',
        'custom-dark-blue': '#054C62',
        'custom-dark-blue-dark': '#043a4d',
        'custom-blue': '#007B98',
        'custom-blue-dark': '#00637a',
        'custom-green': '#81C051',
        'custom-green-dark': '#66993f',
        'custom-orange': '#F28D1C',
        'custom-orange-dark': '#c26f15',
        'custom-light-blue': '#e7f0f4',
        'custom-light-blue-dark': '#b7c5c9',
      },
      boxShadow: {
        'flat-2d': '-2px 2px 0px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  variants: {
    extend: {
      scrollbar: ['rounded'],
    },
  },
  plugins: [
    function({ addUtilities, theme }) {
      addUtilities({
        '.scrollbar': {
          '&::-webkit-scrollbar': {
            width: 'clamp(6px, 0.25vw, 5px)',
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme('colors.slate.400'), // Use Tailwind CSS color
            backgroundOpacity: theme('opacity.50'), // Use Tailwind CSS opacity
            borderRadius: theme('borderRadius.full'), // Use Tailwind CSS border radius
          },
        },
      }, ['responsive', 'hover']);
    },
  ],
}
