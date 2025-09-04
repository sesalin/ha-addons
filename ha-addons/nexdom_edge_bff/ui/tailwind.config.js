/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
        },
      },
      borderRadius: {
        skin: "var(--radius)",
      },
    },
  },
  plugins: [],
};

