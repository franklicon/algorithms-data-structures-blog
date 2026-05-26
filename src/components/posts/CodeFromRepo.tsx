import { useEffect, useState } from 'react';
import { fetchCode, buildRawUrl, FetchCodeOptions } from '../../lib/fetch-code';
import CodeBlock from './CodeBlock';
import { ExternalLink } from 'lucide-react';

interface CodeFromRepoProps extends FetchCodeOptions {
  /** Caption shown above the block; defaults to the file path. */
  caption?: string;
  language?: string;
  /** Override the filename displayed inside the code block; defaults to `path`. */
  filename?: string;
}

export default function CodeFromRepo({
  path,
  branch,
  lines,
  extractClass,
  extractMethod,
  caption,
  language = 'csharp',
  filename,
}: CodeFromRepoProps) {
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setCode(null);
    setError(null);
    fetchCode({ path, branch, lines, extractClass, extractMethod })
      .then((text) => {
        if (!cancelled) setCode(text);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? 'Unknown error');
      });
    return () => {
      cancelled = true;
    };
  }, [path, branch, lines, extractClass, extractMethod]);

  const githubUrl = `https://github.com/franklicon/algorithms-data-structures/blob/${
    branch ?? 'main'
  }/${path}`;

  if (error) {
    return (
      <div className="my-8 p-4 border border-rule dark:border-graphite/60 rounded-md bg-rule/30 dark:bg-graphite/30 brutal:rounded-none brutal:border-2 brutal:border-brutal-ink brutal:bg-brutal-red/20 brutal:shadow-brutal">
        <p className="font-mono text-xs text-ember brutal:text-brutal-ink brutal:font-bold">
          Couldn’t load <span className="underline">{path}</span> — {error}
        </p>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-ember underline mt-2 inline-block brutal:text-black brutal:font-bold brutal:bg-brutal-yellow brutal:no-underline brutal:px-2 brutal:py-0.5 brutal:border-2 brutal:border-brutal-ink"
        >
          View on GitHub →
        </a>
      </div>
    );
  }

  if (code === null) {
    return (
      <div className="my-8 p-4 border border-rule dark:border-graphite/60 rounded-md animate-pulse brutal:rounded-none brutal:border-2 brutal:border-brutal-ink brutal:bg-brutal-mute">
        <p className="font-mono text-xs text-ink/40 dark:text-paper/40 brutal:text-brutal-ink brutal:font-bold">
          Fetching {path}…
        </p>
      </div>
    );
  }

  return (
    <div className="my-8">
      {caption && (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50 mb-2 brutal:text-brutal-ink brutal:font-bold">
          {caption}
        </p>
      )}
      <CodeBlock code={code} language={language} filename={filename ?? path} />
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 hover:text-ember dark:text-paper/50 dark:hover:text-ember transition-colors -mt-4 brutal:text-brutal-ink brutal:font-bold brutal:mt-3 brutal:bg-brutal-paper brutal:border-2 brutal:border-brutal-ink brutal:px-2 brutal:py-1 brutal:shadow-brutal-sm brutal:hover:bg-brutal-yellow brutal:hover:text-black brutal:hover:translate-x-[1px] brutal:hover:translate-y-[1px] brutal:hover:shadow-none"
      >
        <ExternalLink size={11} strokeWidth={1.8} />
        View on GitHub
      </a>
      <p className="sr-only">Source: {buildRawUrl({ path, branch })}</p>
    </div>
  );
}
