import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getPost, CATEGORY_LABEL } from '../data/posts-registry';

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPost(slug) : undefined;

  if (!post) return <Navigate to="/404" replace />;

  const PostBody = post.component;

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
      {/* Back link */}
      <div className="pt-10 pb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 hover:text-ember dark:text-paper/50 dark:hover:text-ember transition-colors brutal:text-brutal-ink brutal:font-bold brutal:border-2 brutal:border-brutal-ink brutal:px-3 brutal:py-1.5 brutal:bg-brutal-paper brutal:shadow-brutal-sm brutal:hover:bg-brutal-yellow brutal:hover:text-black brutal:hover:translate-x-[1px] brutal:hover:translate-y-[1px] brutal:hover:shadow-none"
        >
          <ArrowLeft size={12} strokeWidth={1.8} />
          Back to index
        </Link>
      </div>

      {/* Header */}
      <header className="py-10 lg:py-14 border-b border-rule dark:border-graphite/60 mb-12 lg:mb-16 brutal:border-b-2 brutal:border-brutal-ink">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-6">
          <Link
            to={`/category/${post.category}`}
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-ember hover:underline brutal:text-black brutal:font-bold brutal:bg-brutal-yellow brutal:px-2 brutal:py-0.5 brutal:border-2 brutal:border-brutal-ink brutal:no-underline brutal:hover:no-underline"
          >
            {CATEGORY_LABEL[post.category]}
          </Link>
          <span className="text-ink/30 dark:text-paper/30 brutal:text-brutal-ink">·</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50 brutal:text-brutal-ink brutal:font-bold">
            {formattedDate}
          </span>
          <span className="text-ink/30 dark:text-paper/30 brutal:text-brutal-ink">·</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50 brutal:text-brutal-ink brutal:font-bold">
            {post.readingTime} min read
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tightest text-ink dark:text-paper font-medium break-words brutal:font-sans brutal:font-black brutal:uppercase brutal:tracking-tight brutal:text-brutal-ink">
          {post.title}
        </h1>
        <p className="font-display italic text-lg sm:text-xl text-ink/65 dark:text-paper/65 mt-6 max-w-2xl brutal:font-mono brutal:not-italic brutal:text-brutal-ink brutal:text-base brutal:border-l-4 brutal:border-brutal-ink brutal:pl-4">
          {post.subtitle}
        </p>

        {post.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 mt-8">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50 border border-rule dark:border-graphite/60 px-2 py-1 rounded brutal:rounded-none brutal:border-2 brutal:border-brutal-ink brutal:text-brutal-ink brutal:font-bold brutal:bg-brutal-paper brutal:shadow-brutal-sm"
              >
                #{tag}
              </li>
            ))}
          </ul>
        )}
      </header>

      {/* Body */}
      <div className="grid lg:grid-cols-12 gap-12 pb-24">
        <div className="lg:col-span-8 lg:col-start-3">
          <PostBody />
        </div>
      </div>
    </div>
  );
}
