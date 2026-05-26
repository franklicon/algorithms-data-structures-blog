import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <header className="relative z-20 border-b border-rule dark:border-graphite/60 brutal:border-b-2 brutal:border-brutal-ink brutal:bg-brutal-paper">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-5 flex items-center justify-between gap-3">
        <Link to="/" className="group flex items-baseline gap-3 min-w-0">
          <span className="font-display text-xl sm:text-2xl font-medium tracking-tightest text-ink dark:text-paper truncate brutal:font-sans brutal:font-black brutal:uppercase brutal:tracking-tight brutal:text-brutal-ink">
            The Notebook
          </span>
          <span className="hidden sm:inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50 brutal:text-black brutal:bg-brutal-yellow brutal:px-2 brutal:py-0.5 brutal:border-2 brutal:border-brutal-ink">
            № 001
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-7">
          <NavLink
            to="/category/data-structures"
            className={({ isActive }) =>
              `font-mono text-xs uppercase tracking-[0.18em] transition-colors brutal:font-bold brutal:px-2 brutal:py-1 brutal:border-2 ${
                isActive
                  ? 'text-ember brutal:text-black brutal:bg-brutal-yellow brutal:border-brutal-ink'
                  : 'text-ink/60 hover:text-ink dark:text-paper/60 dark:hover:text-paper brutal:text-brutal-ink brutal:border-transparent brutal:hover:border-brutal-ink brutal:hover:bg-brutal-yellow brutal:hover:text-black'
              }`
            }
          >
            Structures
          </NavLink>
          <NavLink
            to="/category/algorithms"
            className={({ isActive }) =>
              `font-mono text-xs uppercase tracking-[0.18em] transition-colors brutal:font-bold brutal:px-2 brutal:py-1 brutal:border-2 ${
                isActive
                  ? 'text-ember brutal:text-black brutal:bg-brutal-yellow brutal:border-brutal-ink'
                  : 'text-ink/60 hover:text-ink dark:text-paper/60 dark:hover:text-paper brutal:text-brutal-ink brutal:border-transparent brutal:hover:border-brutal-ink brutal:hover:bg-brutal-yellow brutal:hover:text-black'
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
