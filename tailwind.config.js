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
        // .NET-flavored purple system. Token semantics: paper = light surface
        // (background in light / text in dark), ink = dark surface (text in
        // light / background in dark). Both modes are live via the navbar toggle.
        paper: '#FAFAFA',          // light surface — near-white
        ink: '#0E0B16',            // dark surface — near-black with violet undertone
        graphite: '#1B1530',       // elevated dark surface — cards, code-block bg
        ember: '#7C3AED',          // primary accent — violet-600, used for links + ruling
        aurora: '#A78BFA',         // lighter accent — violet-400, hero highlights + hover
        gold: '#F59E0B',           // warm complement — sort/search active cells
        signal: '#F59E0B',         // alias — keeps existing references working
        magenta: '#7C3AED',        // alias — keeps existing references working
        sage: '#7C3AED',           // alias to ember (sage was unused on these surfaces)
        rule: '#E7E2DC',           // light-mode hairlines
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
