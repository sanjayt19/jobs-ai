/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          600: '#4338CA'
        },
        muted: '#6B7280',
        subtle: '#F8FAFC',
        accent: '#FFB86B'
      },
    },
  },
  plugins: [],
}
