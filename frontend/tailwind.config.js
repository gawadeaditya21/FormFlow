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
          DEFAULT: '#7AB2D3',
          light: '#B9E5E8',
          lighter: '#DFF2EB',
          dark: '#4A628A',
        },
        border: '#E5E7EB',
        input: '#E5E7EB',
        ring: '#7AB2D3',
        background: '#FFFFFF',
        foreground: '#1F2937',
        muted: {
          DEFAULT: '#F3F4F6',
          foreground: '#6B7280',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
    },
  },
  plugins: [],
}
