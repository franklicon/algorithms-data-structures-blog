import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../../hooks/useTheme';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({
  code,
  language = 'csharp',
  filename,
  showLineNumbers = true,
}: CodeBlockProps) {
  const { theme } = useTheme();
  const style = theme === 'dark' ? vscDarkPlus : oneLight;

  return (
    <figure className="my-8 group">
      {filename && (
        <figcaption className="flex items-center justify-between px-4 py-2.5 border border-b-0 border-rule dark:border-graphite/60 bg-rule/30 dark:bg-graphite/40 rounded-t-md">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 dark:text-paper/60">
            {filename}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40 dark:text-paper/40">
            {language}
          </span>
        </figcaption>
      )}
      <div
        className={`overflow-hidden border border-rule dark:border-graphite/60 ${
          filename ? 'rounded-b-md' : 'rounded-md'
        }`}
      >
        <SyntaxHighlighter
          language={language}
          style={style}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '1.25rem 1rem',
            fontSize: '13.5px',
            lineHeight: '1.7',
            background: 'transparent',
          }}
          codeTagProps={{
            style: { fontFamily: '"JetBrains Mono", ui-monospace, monospace' },
          }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </figure>
  );
}
