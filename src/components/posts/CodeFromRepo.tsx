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
    fetchCode({ path, branch, lines, extractClass })
      .then((text) => {
        if (!cancelled) setCode(text);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? 'Unknown error');
      });
    return () => {
      cancelled = true;
    };
  }, [path, branch, lines, extractClass]);

  const githubUrl = `https://github.com/franklicon/algorithms-data-structures/blob/${
    branch ?? 'main'
  }/${path}`;

  if (error) {
    return (
      <div className="my-8 p-4 border border-rule dark:border-graphite/60 rounded-md bg-rule/30 dark:bg-graphite/30">
        <p className="font-mono text-xs text-ember">
          Couldn’t load <span className="underline">{path}</span> — {error}
        </p>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-ember underline mt-2 inline-block"
        >
          View on GitHub →
        </a>
      </div>
    );
  }

  if (code === null) {
    return (
      <div className="my-8 p-4 border border-rule dark:border-graphite/60 rounded-md animate-pulse">
        <p className="font-mono text-xs text-ink/40 dark:text-paper/40">
          Fetching {path}…
        </p>
      </div>
    );
  }

  return (
    <div className="my-8">
      {caption && (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50 mb-2">
          {caption}
        </p>
      )}
      <CodeBlock code={code} language={language} filename={filename ?? path} />
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 hover:text-ember dark:text-paper/50 dark:hover:text-ember transition-colors -mt-4"
      >
        <ExternalLink size={11} strokeWidth={1.8} />
        View on GitHub
      </a>
      <p className="sr-only">Source: {buildRawUrl({ path, branch })}</p>
    </div>
  );
}
