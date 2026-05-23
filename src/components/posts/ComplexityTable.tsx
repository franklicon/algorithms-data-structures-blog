interface Row {
  operation: string;
  best?: string;
  average: string;
  worst?: string;
  note?: string;
}

interface ComplexityTableProps {
  rows: Row[];
  caption?: string;
}

export default function ComplexityTable({ rows, caption }: ComplexityTableProps) {
  return (
    <figure className="my-10">
      {caption && (
        <figcaption className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50 mb-3">
          {caption}
        </figcaption>
      )}
      <div className="border-y border-ink/80 dark:border-paper/80 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left">
          <thead>
            <tr className="border-b border-rule dark:border-graphite/60">
              <th className="py-2.5 pr-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 dark:text-paper/60 font-normal">
                Operation
              </th>
              <th className="py-2.5 px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 dark:text-paper/60 font-normal">
                Best
              </th>
              <th className="py-2.5 px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 dark:text-paper/60 font-normal">
                Average
              </th>
              <th className="py-2.5 px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 dark:text-paper/60 font-normal">
                Worst
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.operation}
                className="border-b border-rule/60 dark:border-graphite/40 last:border-b-0"
              >
                <td className="py-3 pr-4 font-display text-base text-ink dark:text-paper">
                  {row.operation}
                  {row.note && (
                    <span className="block font-sans text-xs text-ink/50 dark:text-paper/50 mt-0.5">
                      {row.note}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 font-mono text-sm text-sage">{row.best ?? '—'}</td>
                <td className="py-3 px-4 font-mono text-sm text-ink/80 dark:text-paper/80">
                  {row.average}
                </td>
                <td className="py-3 px-4 font-mono text-sm text-ember">{row.worst ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
