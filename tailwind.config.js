import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            primary: {
              DEFAULT: "#1DB954",
              foreground: "#FFFFFF",
            },
            focus: "#1DB954"
          }
        },
        light: {
          colors: {
            primary: {
              DEFAULT: "#1DB954",
              foreground: "#FFFFFF",
            },
            focus: "#1DB954"
          }
        }
      }
    }),
  ],
};