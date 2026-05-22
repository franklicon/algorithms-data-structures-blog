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
  },
  warning: {
    label: 'Caveat',
    accent: 'border-l-ember',
  },
  insight: {
    label: 'Insight',
    accent: 'border-l-ink dark:border-l-paper',
  },
};

export default function Callout({ variant = 'note', title, children }: CalloutProps) {
  const v = VARIANTS[variant];

  return (
    <aside className={`my-8 pl-5 border-l-2 ${v.accent}`}>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 dark:text-paper/60 mb-2">
        {title ?? v.label}
      </p>
      <div className="text-[16px] leading-[1.7] text-ink/85 dark:text-paper/80 [&>p]:mb-2 last:[&>p]:mb-0">
        {children}
      </div>
    </aside>
  );
}
