import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <header className="relative z-20 border-b border-rule dark:border-graphite/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-5 flex items-center justify-between gap-3">
        <Link to="/" className="group flex items-baseline gap-3 min-w-0">
          <span className="font-display text-xl sm:text-2xl font-medium tracking-tightest text-ink dark:text-paper truncate">
            The Notebook
          </span>
          <span className="hidden sm:inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50">
            № 001
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-7">
          <NavLink
            to="/category/data-structures"
            className={({ isActive }) =>
              `font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                isActive
                  ? 'text-ember'
                  : 'text-ink/60 hover:text-ink dark:text-paper/60 dark:hover:text-paper'
              }`
            }
          >
            Structures
          </NavLink>
          <NavLink
            to="/category/algorithms"
            className={({ isActive }) =>
              `font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                isActive
                  ? 'text-ember'
                  : 'text-ink/60 hover:text-ink dark:text-paper/60 dark:hover:text-paper'
              }`
            }
          >
            Algorithms
          </NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
