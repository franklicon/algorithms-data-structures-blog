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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
      {/* Hero */}
      <section className="pt-20 pb-16 lg:pt-28 lg:pb-24 relative">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ember mb-6 brutal:text-black brutal:bg-brutal-yellow brutal:inline-block brutal:px-2 brutal:py-1 brutal:border-2 brutal:border-brutal-ink brutal:font-bold">
              A field guide · written in C#
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tightest text-ink dark:text-paper font-medium brutal:font-sans brutal:font-black brutal:uppercase brutal:tracking-tight brutal:text-brutal-ink">
              Algorithms,
              <br />
              <em className="font-normal italic text-ember brutal:not-italic brutal:font-black brutal:text-black brutal:bg-brutal-yellow brutal:px-2 brutal:border-2 brutal:border-brutal-ink brutal:shadow-brutal-sm brutal:inline-block">unfolded</em> &mdash;
              <br />
              one structure
              <br />
              at a time.
            </h1>
          </div>
          <div className="lg:col-span-4 lg:pb-4">
            <p className="font-display italic text-lg sm:text-xl leading-relaxed text-ink/65 dark:text-paper/65 brutal:font-mono brutal:not-italic brutal:text-brutal-ink brutal:text-sm brutal:leading-relaxed brutal:border-l-4 brutal:border-brutal-ink brutal:pl-4">
              Implementations from scratch, complexity examined honestly, and
              interactive visualizations to make the moving parts visible.
            </p>
          </div>
        </div>

        {/* Decorative rule */}
        <div className="mt-16 flex items-center gap-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/40 dark:text-paper/40 brutal:text-brutal-ink brutal:font-bold">
            № 001 — Vol. I
          </span>
          <div className="flex-1 hairline" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/40 dark:text-paper/40 brutal:text-brutal-ink brutal:font-bold">
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
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/50 dark:text-paper/50 brutal:text-brutal-ink"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search entries"
            className="w-full pl-9 pr-3 py-2.5 font-mono text-xs uppercase tracking-[0.18em] border border-rule dark:border-graphite/60 bg-transparent text-ink dark:text-paper rounded focus:outline-none focus:border-ember placeholder:text-ink/40 dark:placeholder:text-paper/40 brutal:rounded-none brutal:border-2 brutal:border-brutal-ink brutal:bg-brutal-paper brutal:text-brutal-ink brutal:placeholder:text-brutal-ink/50 brutal:shadow-brutal-sm brutal:focus:border-brutal-ink brutal:font-bold"
          />
        </div>
      </section>

      {/* Entries */}
      <section className="pb-24">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50 dark:text-paper/50 mb-6 brutal:text-brutal-ink brutal:font-black brutal:text-base brutal:bg-brutal-ink brutal:text-brutal-paper brutal:inline-block brutal:px-3 brutal:py-1">
          Entries
        </h2>

        {results.length === 0 ? (
          <p className="font-display italic text-lg sm:text-xl text-ink/65 dark:text-paper/65 brutal:font-mono brutal:not-italic brutal:text-black brutal:border-2 brutal:border-brutal-ink brutal:p-4 brutal:bg-brutal-yellow">
            No entries match &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <ol className="divide-y divide-rule dark:divide-graphite/60 brutal:divide-y-0 brutal:space-y-5">
            {results.map((post, idx) => (
              <li key={post.slug}>
                <Link
                  to={`/posts/${post.slug}`}
                  className="group block py-8 lg:py-10 grid grid-cols-12 gap-6 items-baseline hover:bg-rule/20 dark:hover:bg-graphite/20 -mx-4 px-4 rounded transition-all brutal:rounded-none brutal:border-2 brutal:border-brutal-ink brutal:bg-brutal-paper brutal:shadow-brutal brutal:px-5 brutal:py-6 brutal:lg:py-6 brutal:mx-0 brutal:hover:translate-x-[3px] brutal:hover:translate-y-[3px] brutal:hover:shadow-none brutal:hover:bg-brutal-yellow brutal:[&:hover_*]:text-black"
                >
                  <div className="col-span-2 sm:col-span-1 font-mono text-xs text-ink/40 dark:text-paper/40 tabular-nums brutal:text-brutal-ink brutal:font-black brutal:text-base">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="col-span-10 sm:col-span-7">
                    <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tightest text-ink dark:text-paper group-hover:text-ember transition-colors break-words brutal:font-sans brutal:font-black brutal:uppercase brutal:tracking-tight brutal:text-brutal-ink brutal:group-hover:text-brutal-ink">
                      {post.title}
                    </h3>
                    <p className="font-display italic text-ink/65 dark:text-paper/65 text-base sm:text-lg mt-2 brutal:font-mono brutal:not-italic brutal:text-brutal-ink brutal:text-sm brutal:mt-3">
                      {post.subtitle}
                    </p>
                  </div>
                  <div className="col-span-12 sm:col-span-4 flex sm:justify-end gap-3 mt-4 sm:mt-0">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50 brutal:text-brutal-ink brutal:font-bold brutal:border-2 brutal:border-brutal-ink brutal:px-2 brutal:py-0.5">
                      {CATEGORY_LABEL[post.category]}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40 dark:text-paper/40 brutal:text-brutal-ink brutal:font-bold">
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
