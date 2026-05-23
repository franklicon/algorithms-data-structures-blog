import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ember mb-6">
        Colophon
      </p>
      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tightest text-ink dark:text-paper font-medium mb-10 break-words">
        About this notebook.
      </h1>

      <div className="prose-editorial">
        <p>
          This is a working notebook on algorithms and data structures. Each
          entry pairs a careful written explanation with a runnable C#
          implementation and, where it helps, a small visualization you can
          play with.
        </p>
        <p>
          The code samples are not pasted in. They are pulled live from the{' '}
          <a
            href="https://github.com/franklicon/algorithms-data-structures"
            target="_blank"
            rel="noopener noreferrer"
          >
            companion repository
          </a>{' '}
          so that improvements to an implementation are reflected here on the
          next page load.
        </p>

        <h2>Editorial principles</h2>
        <p>
          One entry per structure or algorithm. Complexity stated honestly,
          including the cases where Big-O lies about real-world performance.
          Code that compiles and tests that pass.
        </p>

        <h2>Built with</h2>
        <p>
          React, TypeScript, Tailwind, Framer Motion, and Vite. Set in{' '}
          <em>Fraunces</em> for display, <em>Public Sans</em> for body, and{' '}
          <em>JetBrains Mono</em> for code.
        </p>

        <p className="mt-10">
          <Link to="/" className="text-ember underline">
            ← Back to the index
          </Link>
        </p>
      </div>
    </div>
  );
}
