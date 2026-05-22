# The Notebook · Algorithms & Data Structures Blog

A field guide to algorithms and data structures, written as a working notebook.
Each entry pairs a careful written explanation with a runnable C# implementation
(pulled live from the [companion repository](https://github.com/franklicon/algorithms-data-structures))
and, where it helps, an interactive visualization.

## Stack

- **Vite + React 18 + TypeScript**
- **TailwindCSS** with a custom editorial theme (Fraunces / Public Sans / JetBrains Mono)
- **React Router** (HashRouter, for clean GitHub Pages routing)
- **Framer Motion** for visualizations
- **react-syntax-highlighter** for code blocks
- **Fuse.js** for fuzzy search
- Deploys to **GitHub Pages** via GitHub Actions

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:5173.

## Build

```bash
npm run build
npm run preview
```

## Deploy

Pushes to `main` trigger the workflow in `.github/workflows/deploy.yml`,
which builds the site and publishes `dist/` to GitHub Pages.

**One-time setup:** in the repo settings → *Pages*, set **Source** to
*GitHub Actions*.

The deployed URL will be:
`https://franklicon.github.io/algorithms-data-structures-blog/`

> If you fork or rename the repo, update `base` in `vite.config.ts` to match
> the new repository name.

## Project structure

```
src/
  components/
    layout/         Navbar, Footer, ThemeToggle, Layout
    posts/          Building blocks for posts: CodeBlock, CodeFromRepo,
                    ComplexityTable, Callout
    visualizers/    Interactive components (LinkedListVisualizer, …)
  pages/            Home, PostPage, CategoryPage, About, NotFound
  posts/            One TSX file per entry, grouped by category
  data/
    posts-registry.ts   Metadata index for every entry
  hooks/
    useTheme.tsx        Light/dark with localStorage persistence
  lib/
    fetch-code.ts       Pulls raw .cs files from the companion repo
  styles/
    index.css           Tailwind + editorial typography layer
```

## Adding a new entry

1. Create the post component under `src/posts/<category>/<slug>.tsx`.
   Use the existing `linked-list.tsx` as a template — it shows every
   reusable building block in action.
2. Register it in `src/data/posts-registry.ts`.
3. If you want code pulled live from the C# repo, use:

   ```tsx
   <CodeFromRepo path="src/DataStructures/YourFile.cs" />
   ```

That’s it — the new post is automatically searchable from the home page and
appears under its category.

## License

MIT
