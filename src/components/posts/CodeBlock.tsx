import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
  const style = theme === 'dark' ? oneDark : oneLight;

  return (
    <figure className="my-8 group relative">
      {/* Violet left accent bar — runs the full height, ties code blocks to the .NET palette */}
      <div
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-ember rounded-l-md"
      />
      {filename && (
        <figcaption className="flex items-center justify-between pl-5 pr-4 py-2.5 border border-b-0 border-rule dark:border-graphite/60 bg-rule/30 dark:bg-graphite/40 rounded-t-md">
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/70 dark:text-paper/70">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-ember" />
            {filename}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ember/80 dark:text-aurora/80">
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
            padding: '1.25rem 1rem 1.25rem 1.25rem',
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
