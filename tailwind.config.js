module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          '0%' : { left: '-800px' }, 
          '100%' : { left: '0' }
        }
      }, 
      animation: {
        slideIn: 'slideIn 0.3s ease-in'
      }

    },
  },
  plugins: [],
}
