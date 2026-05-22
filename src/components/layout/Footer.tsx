import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-rule dark:border-graphite/60">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-display text-lg text-ink dark:text-paper">The Notebook</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50 mt-1">
            A field guide · written in C#
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/franklicon/algorithms-data-structures"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ink/60 hover:text-ember dark:text-paper/60 dark:hover:text-ember transition-colors"
          >
            <Github size={14} strokeWidth={1.6} />
            Source
          </a>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/40 dark:text-paper/40">
            © {new Date().getFullYear()} · Francisco Licón
          </p>
        </div>
      </div>
    </footer>
  );
}
