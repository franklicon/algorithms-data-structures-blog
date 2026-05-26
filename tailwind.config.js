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
        // Brutalist palette. Top-level tokens are constants; `brutal.*`
        // tokens that need to flip with mode (paper/ink/mute/rule + shadow)
        // are CSS variables defined in index.css.
        paper: '#FFFFFF',          // pure white — light surface
        ink: '#000000',            // pure black — dark surface
        graphite: '#262626',       // neutral dark gray — dark-mode card/border bg
        ember: '#FFD500',          // primary accent — caution yellow (was violet)
        signal: '#FFD500',         // alias — yellow (sort/search active cells)
        sage: '#FFD500',           // alias — yellow (visualizer pointer arrows)
        rule: '#D4D4D4',           // light-mode 1px hairlines (literal hex so /60 opacity modifiers compile)

        // Neo-brutalist tokens — the site's design language. Surface,
        // foreground, mute, and shadow are CSS variables that flip when
        // <html> has class "dark"; accent colors (yellow/red/blue) stay
        // constant in both modes. See index.css for the variable values.
        brutal: {
          paper: 'var(--brutal-paper)',  // surface: white (light) / black (dark)
          ink: 'var(--brutal-ink)',      // foreground + 2px borders: black (light) / white (dark)
          mute: 'var(--brutal-mute)',    // alt row / subdued surface: cream (light) / near-black (dark)
          yellow: '#FFD500',             // primary accent — caution yellow
          red: '#FF4D4D',                // destructive / warning accent
          blue: '#3B82F6',               // info / link accent
        },
      },
      boxShadow: {
        // Brutalist hard offset shadows. Color tracks --brutal-shadow,
        // which is #000 in light mode and #FFF in dark mode.
        brutal: '4px 4px 0 0 var(--brutal-shadow)',
        'brutal-sm': '2px 2px 0 0 var(--brutal-shadow)',
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
  plugins: [
    function ({ addVariant }) {
      addVariant('brutal', 'html.brutal &');
    },
  ],
};
