# Mark Hazleton's Notes

Personal site for Mark Hazleton, a Technical Solutions Architect. The site combines long-form writing, a project portfolio, and a living /now page that highlights current focus areas and recent GitHub activity.

## What this site includes

- Blog posts on cloud architecture, integration patterns, and engineering practices.
- A /now page with current focus areas, recent articles, and live repository metrics.
- Project pages with summaries, metadata, and links to live demos or repos.
- About and contact pages for context and collaboration.

## Tech stack

- React 19 + React Router
- Vite 7 with SSR rendering and static prerendering
- TypeScript
- Tailwind CSS, shadcn/ui, Radix UI
- React Markdown + remark-gfm for article content
- GitHub Pages deployment via GitHub Actions

## Architecture and data flow

- Content sources:
  - Blog metadata in `src/data/articles.json`.
  - Blog content in Markdown under `src/data/content/*.md`.
  - Project metadata in `src/data/projects.json`.
  - Images and media in `src/data/img` and `src/data/video`.
  - Static site assets in `src/static` (favicon, placeholder, .nojekyll).
- Rendering pipeline:
  - Client bundle built with Vite.
  - SSR bundle generated from `src/entry-server.tsx`.
  - `src/scripts/prerender.mjs` renders static HTML for all routes (including blog posts, projects, /now, and repository detail pages).
  - Build output is written directly to `docs/` for GitHub Pages.
- Live repository metrics:
  - `/now` pulls data from `https://raw.githubusercontent.com/markhazleton/github-stats-spark/main/data/repositories.json`.
  - During prerendering, the data is inlined so the first paint includes repository stats.
- SEO:
  - `src/scripts/generate-seo-assets.mjs` builds `docs/sitemap.xml`, `docs/robots.txt`, and `docs/feed.xml`.
  - The `Seo` component manages canonical URLs, Open Graph, and Twitter meta tags.

## Local development

Prerequisites:

- Node.js 20 (matches CI)
- npm

Commands:

```sh
npm install
npm run dev
```

The dev server runs on `http://localhost:8080`.

## Build and deploy

```sh
npm run build
```

The build pipeline:

- Builds client and SSR bundles.
- Prerenders routes to static HTML.
- Syncs content assets into `docs/`.
- Generates SEO assets in `docs/`.

GitHub Pages deployment is automated in `.github/workflows/deploy.yml` on pushes to `main`.

## Common scripts

- `npm run dev` - local development server
- `npm run build` - full production build + prerender + publish to `docs/`
- `npm run build:docs` - GitHub Pages build with base path and site URL
- `npm run preview` - preview the production build locally
- `npm run lint` - lint with ESLint
- `npm run type-check` - TypeScript type check

## Configuration

Build-time environment variables:

- `VITE_BASE_PATH` - base path for assets and routing (e.g. `/mark-hazleton-s-notes/` for GitHub Pages).
- `VITE_SITE_URL` - canonical site URL used in SEO metadata.
- `SITE_URL` - used by SEO asset generation scripts; defaults to `VITE_SITE_URL` if provided.

## Repository structure

```text
src/
  components/     UI building blocks
  data/           articles, projects, and media assets
  hooks/          data-fetching and client state
  lib/            shared site utilities and SEO helpers
  pages/          route-level pages
  scripts/        build helpers (SEO, prerender, asset sync)
  static/         favicon, placeholder, and other static assets
  types/          TypeScript models
docs/             GitHub Pages output (generated)
```

## Content updates

- Add a blog post:
  1) Add a Markdown file in `src/data/content/`.
  2) Add metadata to `src/data/articles.json`.
  3) Optional images go in `src/data/img`.
- Update projects:
  - Edit `src/data/projects.json`. The `projects.ts` adapter normalizes data at runtime.
- Update /now repository metrics:
  - Update the `github-stats-spark` data feed; the site will pick up new JSON on build or client fetch.

## License

- Code (source, build scripts, and configuration) is licensed under the MIT License. See `LICENSE`.
- Written content (blog posts, project descriptions, and other prose in `src/data`) is licensed under CC BY-NC 4.0. See `LICENSE-CONTENT`.
