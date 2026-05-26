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
        <figcaption className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50 mb-3 brutal:text-black brutal:font-black brutal:bg-brutal-yellow brutal:inline-block brutal:px-2 brutal:py-1 brutal:border-2 brutal:border-brutal-ink">
          {caption}
        </figcaption>
      )}
      <div className="border-y border-ink/80 dark:border-paper/80 overflow-x-auto brutal:border-2 brutal:border-brutal-ink brutal:shadow-brutal brutal:bg-brutal-paper">
        <table className="w-full min-w-[520px] text-left">
          <thead className="brutal:bg-brutal-ink">
            <tr className="border-b border-rule dark:border-graphite/60 brutal:border-b-2 brutal:border-brutal-ink">
              <th className="py-2.5 pr-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 dark:text-paper/60 font-normal brutal:text-brutal-paper brutal:font-black brutal:px-3">
                Operation
              </th>
              <th className="py-2.5 px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 dark:text-paper/60 font-normal brutal:text-brutal-paper brutal:font-black">
                Best
              </th>
              <th className="py-2.5 px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 dark:text-paper/60 font-normal brutal:text-brutal-paper brutal:font-black">
                Average
              </th>
              <th className="py-2.5 px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 dark:text-paper/60 font-normal brutal:text-brutal-paper brutal:font-black">
                Worst
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.operation}
                className={`border-b border-rule/60 dark:border-graphite/40 last:border-b-0 brutal:border-b-2 brutal:border-brutal-ink brutal:last:border-b-0 ${
                  idx % 2 === 1 ? 'brutal:bg-brutal-mute' : ''
                }`}
              >
                <td className="py-3 pr-4 font-display text-base text-ink dark:text-paper brutal:font-sans brutal:font-bold brutal:text-brutal-ink brutal:px-3">
                  {row.operation}
                  {row.note && (
                    <span className="block font-sans text-xs text-ink/50 dark:text-paper/50 mt-0.5 brutal:text-brutal-ink/75 brutal:font-normal">
                      {row.note}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 font-mono text-sm text-sage brutal:text-brutal-ink brutal:font-bold brutal:bg-brutal-yellow/40">{row.best ?? '—'}</td>
                <td className="py-3 px-4 font-mono text-sm text-ink/80 dark:text-paper/80 brutal:text-brutal-ink brutal:font-bold">
                  {row.average}
                </td>
                <td className="py-3 px-4 font-mono text-sm text-ember brutal:text-white brutal:font-bold brutal:bg-brutal-red">{row.worst ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
