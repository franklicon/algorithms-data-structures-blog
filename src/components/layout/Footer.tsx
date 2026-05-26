import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-rule dark:border-graphite/60 brutal:border-t-2 brutal:border-brutal-ink brutal:bg-brutal-paper">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-display text-lg text-ink dark:text-paper brutal:font-sans brutal:font-black brutal:uppercase brutal:text-brutal-ink">The Notebook</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50 mt-1 brutal:text-brutal-ink">
            A field guide · written in C#
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            to="/about"
            className="font-mono text-xs uppercase tracking-[0.18em] text-ink/60 hover:text-ember dark:text-paper/60 dark:hover:text-ember transition-colors brutal:font-bold brutal:text-brutal-ink brutal:hover:bg-brutal-yellow brutal:hover:text-black brutal:px-2 brutal:py-1"
          >
            Colophon
          </Link>
          <a
            href="https://github.com/franklicon/algorithms-data-structures"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ink/60 hover:text-ember dark:text-paper/60 dark:hover:text-ember transition-colors brutal:font-bold brutal:text-brutal-ink brutal:hover:bg-brutal-yellow brutal:hover:text-black brutal:px-2 brutal:py-1"
          >
            <Github size={14} strokeWidth={1.6} />
            Source
          </a>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/40 dark:text-paper/40 brutal:text-brutal-ink">
            © {new Date().getFullYear()} · Francisco Licón
          </p>
        </div>
      </div>
    </footer>
  );
}
