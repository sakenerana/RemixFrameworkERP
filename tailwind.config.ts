import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'infinite-scroll': 'infinite-scroll 25s linear infinite',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'], // This will make Montserrat the default font
      },
      backdropBlur: {
        xs: '2px',
      },
      backdropBrightness: {
        95: '0.95',
      }
    },
  },
  plugins: [],
} satisfies Config;
