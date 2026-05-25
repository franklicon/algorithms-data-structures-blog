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
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 hover:text-ember dark:text-paper/50 dark:hover:text-ember transition-colors"
        >
          <ArrowLeft size={12} strokeWidth={1.8} />
          Back to index
        </Link>
      </div>

      {/* Header */}
      <header className="py-10 lg:py-14 border-b border-rule dark:border-graphite/60 mb-12 lg:mb-16">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-6">
          <Link
            to={`/category/${post.category}`}
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-ember hover:underline"
          >
            {CATEGORY_LABEL[post.category]}
          </Link>
          <span className="text-ink/30 dark:text-paper/30">·</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50">
            {formattedDate}
          </span>
          <span className="text-ink/30 dark:text-paper/30">·</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50">
            {post.readingTime} min read
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tightest text-ink dark:text-paper font-medium break-words">
          {post.title}
        </h1>
        <p className="font-display italic text-lg sm:text-xl text-ink/65 dark:text-paper/65 mt-6 max-w-2xl">
          {post.subtitle}
        </p>

        {post.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 mt-8">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50 border border-rule dark:border-graphite/60 px-2 py-1 rounded"
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
