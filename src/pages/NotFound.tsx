import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-32 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ember mb-6 brutal:text-white brutal:bg-brutal-red brutal:inline-block brutal:px-2 brutal:py-1 brutal:border-2 brutal:border-brutal-ink brutal:font-bold brutal:shadow-brutal-sm">
        Error · 404
      </p>
      <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tightest text-ink dark:text-paper font-medium mb-6 brutal:font-sans brutal:font-black brutal:uppercase brutal:tracking-tight brutal:text-brutal-ink">
        Page not found.
      </h1>
      <p className="font-display italic text-lg sm:text-xl text-ink/65 dark:text-paper/65 mb-10 brutal:font-mono brutal:not-italic brutal:text-brutal-ink">
        The pointer you followed leads to <code>null</code>.
      </p>
      <Link
        to="/"
        className="inline-block font-mono text-xs uppercase tracking-[0.18em] text-ember underline underline-offset-4 brutal:no-underline brutal:font-bold brutal:text-brutal-ink brutal:border-2 brutal:border-brutal-ink brutal:px-3 brutal:py-1.5 brutal:bg-brutal-paper brutal:shadow-brutal-sm brutal:hover:bg-brutal-yellow brutal:hover:text-black brutal:hover:translate-x-[1px] brutal:hover:translate-y-[1px] brutal:hover:shadow-none"
      >
        ← Back to the index
      </Link>
    </div>
  );
}
