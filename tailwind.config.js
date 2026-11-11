/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { fontFamily: { sans: ['Inter', 'sans-serif'] }, colors: { ink: '#070b14', panel: '#0d1422', line: '#1b2940', cyan: '#52e4ff' } } },
  plugins: []
}
