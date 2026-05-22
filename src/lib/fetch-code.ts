/**
 * Fetches raw source code from the companion C# repository.
 * The blog stays in sync with the canonical implementation — when the
 * algorithm is improved in the source repo, the post reflects it automatically.
 */

const REPO_OWNER = 'franklicon';
const REPO_NAME = 'algorithms-data-structures';
const DEFAULT_BRANCH = 'main';

export interface FetchCodeOptions {
  path: string;
  branch?: string;
  /** Optional [startLine, endLine] (1-indexed, inclusive). */
  lines?: [number, number];
  /**
   * Extract a single class declaration by name, including its body.
   * Uses brace-balancing rather than line ranges so the extract survives
   * unrelated edits to the surrounding file.
   */
  extractClass?: string;
}

export function buildRawUrl({ path, branch = DEFAULT_BRANCH }: FetchCodeOptions): string {
  return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${branch}/${path}`;
}

export async function fetchCode(options: FetchCodeOptions): Promise<string> {
  const url = buildRawUrl(options);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  let text = await res.text();
  if (options.extractClass) {
    text = extractClassByName(text, options.extractClass);
  }
  if (options.lines) {
    const [start, end] = options.lines;
    text = text
      .split('\n')
      .slice(start - 1, end)
      .join('\n');
  }
  return text;
}

/**
 * Pulls a class declaration (and only its declaration + body) out of a C# source file.
 * Locates the first line matching `class <name>` and tracks brace depth to find
 * the matching closing brace. The result is dedented to a flush-left indentation
 * so it reads naturally in a CodeBlock.
 */
function extractClassByName(source: string, className: string): string {
  const lines = source.split('\n');
  const declRegex = new RegExp(`\\bclass\\s+${className}\\b`);
  const startIdx = lines.findIndex((line) => declRegex.test(line));
  if (startIdx === -1) {
    throw new Error(`Class "${className}" not found in source`);
  }

  let depth = 0;
  let opened = false;
  let endIdx = -1;
  for (let i = startIdx; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if (ch === '{') {
        depth++;
        opened = true;
      } else if (ch === '}') {
        depth--;
        if (opened && depth === 0) {
          endIdx = i;
          break;
        }
      }
    }
    if (endIdx !== -1) break;
  }
  if (endIdx === -1) {
    throw new Error(`Class "${className}" body not balanced`);
  }

  const sliced = lines.slice(startIdx, endIdx + 1);
  return dedent(sliced);
}

function dedent(lines: string[]): string {
  const indents = lines
    .filter((l) => l.trim().length > 0)
    .map((l) => l.match(/^[\t ]*/)?.[0].length ?? 0);
  if (indents.length === 0) return lines.join('\n');
  const minIndent = Math.min(...indents);
  return lines.map((l) => l.slice(minIndent)).join('\n');
}
