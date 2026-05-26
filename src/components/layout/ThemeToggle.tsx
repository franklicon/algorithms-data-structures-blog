import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Theme: ${theme} — click for ${isDark ? 'light' : 'dark'}`}
      className="relative w-9 h-9 flex items-center justify-center rounded-full border border-rule dark:border-graphite/60 text-ink dark:text-paper hover:bg-rule/40 dark:hover:bg-graphite/40 transition-all brutal:rounded-none brutal:border-2 brutal:border-brutal-ink brutal:bg-brutal-yellow brutal:text-black brutal:shadow-brutal-sm brutal:hover:translate-x-[1px] brutal:hover:translate-y-[1px] brutal:hover:shadow-none brutal:hover:bg-brutal-yellow"
    >
      {isDark ? <Sun size={15} strokeWidth={1.6} /> : <Moon size={15} strokeWidth={1.6} />}
    </button>
  );
}
