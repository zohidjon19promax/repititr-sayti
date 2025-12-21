/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        primary: "var(--primary)",
        // ... boshqa ranglar
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}