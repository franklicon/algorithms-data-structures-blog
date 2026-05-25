import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-32 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ember mb-6">
        Error · 404
      </p>
      <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tightest text-ink dark:text-paper font-medium mb-6">
        Page not found.
      </h1>
      <p className="font-display italic text-lg sm:text-xl text-ink/65 dark:text-paper/65 mb-10">
        The pointer you followed leads to <code>null</code>.
      </p>
      <Link
        to="/"
        className="inline-block font-mono text-xs uppercase tracking-[0.18em] text-ember underline underline-offset-4"
      >
        ← Back to the index
      </Link>
    </div>
  );
}
