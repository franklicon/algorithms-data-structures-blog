import { ReactNode } from 'react';

interface CalloutProps {
  variant?: 'note' | 'warning' | 'insight';
  title?: string;
  children: ReactNode;
}

const VARIANTS = {
  note: {
    label: 'Note',
    accent: 'border-l-sage',
    brutalBar: 'brutal:bg-brutal-blue brutal:text-white',
  },
  warning: {
    label: 'Caveat',
    accent: 'border-l-ember',
    brutalBar: 'brutal:bg-brutal-red brutal:text-white',
  },
  insight: {
    label: 'Insight',
    accent: 'border-l-ink dark:border-l-paper',
    brutalBar: 'brutal:bg-brutal-yellow brutal:text-black',
  },
};

export default function Callout({ variant = 'note', title, children }: CalloutProps) {
  const v = VARIANTS[variant];

  return (
    <aside
      className={`my-8 pl-5 border-l-2 ${v.accent} brutal:pl-0 brutal:border-l-0 brutal:border-2 brutal:border-brutal-ink brutal:bg-brutal-paper brutal:shadow-brutal`}
    >
      <p
        className={`font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 dark:text-paper/60 mb-2 brutal:mb-0 brutal:px-4 brutal:py-2 brutal:font-black brutal:tracking-normal brutal:text-xs ${v.brutalBar}`}
      >
        {title ?? v.label}
      </p>
      <div className="text-[16px] leading-[1.7] text-ink/85 dark:text-paper/80 [&>p]:mb-2 last:[&>p]:mb-0 brutal:text-brutal-ink brutal:p-4 brutal:border-t-2 brutal:border-brutal-ink">
        {children}
      </div>
    </aside>
  );
}
