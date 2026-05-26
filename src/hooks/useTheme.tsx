import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'dsa-blog-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  // First-visit default: light. Returning visitors keep whatever they
  // last toggled to (read from localStorage above).
  return 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    // Brutalist is always on — it's the site's design language now,
    // not an opt-in evaluation theme. The `brutal:` Tailwind variant
    // (selector: html.brutal &) therefore matches in both modes.
    root.classList.add('brutal');
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () => setThemeState((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
