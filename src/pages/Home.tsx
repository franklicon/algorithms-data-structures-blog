import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Fuse from 'fuse.js';
import { posts, CATEGORY_LABEL, PostMeta } from '../data/posts-registry';

export default function Home() {
  const [query, setQuery] = useState('');

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ['title', 'subtitle', 'tags', 'category'],
        threshold: 0.35,
      }),
    []
  );

  const results: PostMeta[] = query
    ? fuse.search(query).map((r) => r.item)
    : posts;

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10">
      {/* Hero */}
      <section className="pt-20 pb-16 lg:pt-28 lg:pb-24 relative">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ember mb-6">
              A field guide · written in C#
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tightest text-ink dark:text-paper font-medium">
              Algorithms,
              <br />
              <em className="font-normal italic text-ember">unfolded</em> &mdash;
              <br />
              one structure
              <br />
              at a time.
            </h1>
          </div>
          <div className="lg:col-span-4 lg:pb-4">
            <p className="font-display text-lg leading-relaxed text-ink/70 dark:text-paper/70 italic">
              Implementations from scratch, complexity examined honestly, and
              interactive visualizations to make the moving parts visible.
            </p>
          </div>
        </div>

        {/* Decorative rule */}
        <div className="mt-16 flex items-center gap-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/40 dark:text-paper/40">
            № 001 — Vol. I
          </span>
          <div className="flex-1 hairline" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/40 dark:text-paper/40">
            {posts.length} {posts.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
      </section>

      {/* Search */}
      <section className="mb-12">
        <div className="relative max-w-md">
          <Search
            size={14}
            strokeWidth={1.8}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/50 dark:text-paper/50"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search entries"
            className="w-full pl-9 pr-3 py-2.5 font-mono text-xs uppercase tracking-[0.18em] border border-rule dark:border-graphite/60 bg-transparent text-ink dark:text-paper rounded focus:outline-none focus:border-ember placeholder:text-ink/40 dark:placeholder:text-paper/40"
          />
        </div>
      </section>

      {/* Entries */}
      <section className="pb-24">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50 dark:text-paper/50 mb-6">
          Entries
        </h2>

        {results.length === 0 ? (
          <p className="font-display italic text-ink/60 dark:text-paper/60 text-lg">
            No entries match &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <ol className="divide-y divide-rule dark:divide-graphite/60">
            {results.map((post, idx) => (
              <li key={post.slug}>
                <Link
                  to={`/posts/${post.slug}`}
                  className="group block py-8 lg:py-10 grid grid-cols-12 gap-6 items-baseline hover:bg-rule/20 dark:hover:bg-graphite/20 -mx-4 px-4 rounded transition-colors"
                >
                  <div className="col-span-1 font-mono text-xs text-ink/40 dark:text-paper/40 tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="col-span-12 sm:col-span-7">
                    <h3 className="font-display text-3xl lg:text-4xl font-medium tracking-tightest text-ink dark:text-paper group-hover:text-ember transition-colors">
                      {post.title}
                    </h3>
                    <p className="font-display italic text-ink/65 dark:text-paper/65 text-lg mt-2">
                      {post.subtitle}
                    </p>
                  </div>
                  <div className="col-span-12 sm:col-span-4 flex sm:justify-end gap-3 mt-4 sm:mt-0">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50">
                      {CATEGORY_LABEL[post.category]}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40 dark:text-paper/40">
                      {post.readingTime} min
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
