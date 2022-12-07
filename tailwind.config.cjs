/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
        
          "primary": "#6fffe9",
                  
          "secondary": "#5bc0be",
                  
          "accent": "#FDAFFF",
                  
          "neutral": "#0b132b",
                  
          "base-100": "#1c2541",
                  
          "info": "#3ABFF8",
                  
          "success": "#36D399",
                  
          "warning": "#FBBD23",
                  
          "error": "#F87272",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
