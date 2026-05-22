/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Editorial serif for display & headings
        display: ['"Fraunces"', '"Cormorant Garamond"', 'serif'],
        // Refined sans for body
        sans: ['"Public Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        // Mono with character for code
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Warm, editorial palette
        paper: '#FAF7F2',
        ink: '#1A1A1F',
        graphite: '#2B2B33',
        ember: '#C2410C', // warm accent — used sparingly
        sage: '#5F7A6A',
        rule: '#E5DFD3',
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '68ch',
          },
        },
      },
    },
  },
  plugins: [],
};
