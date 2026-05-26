import { useParams, Link, Navigate } from 'react-router-dom';
import { CATEGORY_LABEL, Category, getPostsByCategory } from '../data/posts-registry';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();

  if (!category || !(category in CATEGORY_LABEL)) {
    return <Navigate to="/404" replace />;
  }

  const cat = category as Category;
  const items = getPostsByCategory(cat);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
      <header className="pt-16 pb-12 lg:pt-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ember mb-4 brutal:text-black brutal:bg-brutal-yellow brutal:inline-block brutal:px-2 brutal:py-1 brutal:border-2 brutal:border-brutal-ink brutal:font-bold">
          Section
        </p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tightest text-ink dark:text-paper font-medium break-words brutal:font-sans brutal:font-black brutal:uppercase brutal:tracking-tight brutal:text-brutal-ink">
          {CATEGORY_LABEL[cat]}
        </h1>
      </header>

      <div className="hairline mb-2" />

      {items.length === 0 ? (
        <p className="font-display italic text-lg sm:text-xl text-ink/65 dark:text-paper/65 py-12 brutal:font-mono brutal:not-italic brutal:text-black brutal:border-2 brutal:border-brutal-ink brutal:p-4 brutal:bg-brutal-yellow brutal:my-6">
          No entries yet — coming soon.
        </p>
      ) : (
        <ol className="divide-y divide-rule dark:divide-graphite/60 brutal:divide-y-0 brutal:space-y-5 brutal:mt-8">
          {items.map((post, idx) => (
            <li key={post.slug}>
              <Link
                to={`/posts/${post.slug}`}
                className="group block py-8 lg:py-10 grid grid-cols-12 gap-6 items-baseline hover:bg-rule/20 dark:hover:bg-graphite/20 -mx-4 px-4 rounded transition-all brutal:rounded-none brutal:border-2 brutal:border-brutal-ink brutal:bg-brutal-paper brutal:shadow-brutal brutal:px-5 brutal:py-6 brutal:lg:py-6 brutal:mx-0 brutal:hover:translate-x-[3px] brutal:hover:translate-y-[3px] brutal:hover:shadow-none brutal:hover:bg-brutal-yellow brutal:[&:hover_*]:text-black"
              >
                <div className="col-span-2 sm:col-span-1 font-mono text-xs text-ink/40 dark:text-paper/40 tabular-nums brutal:text-brutal-ink brutal:font-black brutal:text-base">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="col-span-10 sm:col-span-11">
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tightest text-ink dark:text-paper group-hover:text-ember transition-colors break-words brutal:font-sans brutal:font-black brutal:uppercase brutal:tracking-tight brutal:text-brutal-ink brutal:group-hover:text-brutal-ink">
                    {post.title}
                  </h2>
                  <p className="font-display italic text-ink/65 dark:text-paper/65 text-base sm:text-lg mt-2 brutal:font-mono brutal:not-italic brutal:text-brutal-ink brutal:text-sm brutal:mt-3">
                    {post.subtitle}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
