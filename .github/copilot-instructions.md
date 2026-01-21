# GitHub Copilot Instructions for Mark Hazleton's Notes

## Project Overview

Mark Hazleton's Notes is a personal technical blog and portfolio site built as a static React application. The site showcases blog posts about cloud architecture, integration patterns, AI/ML, and software engineering, along with a project portfolio and live GitHub activity dashboard.

**Primary Purpose**: Publish technical writing and demonstrate technical expertise in a discoverable, performant, and accessible way.

**Deployment**: Static site hosted on GitHub Pages at `https://markhazleton.github.io/mark-hazleton-s-notes/`

## Architecture Context

### Stack

- **Frontend**: React 19 + React Router 7
- **Build**: Vite 7 with SSR (build-time only) and static prerendering
- **Styling**: Tailwind CSS 4 + shadcn/ui components + Radix UI primitives
- **Language**: TypeScript (strict mode)
- **Markdown**: React Markdown with remark-gfm
- **State Management**: React Context + TanStack Query

### Key Architectural Principles

1. **Static-First**: Everything must be prerenderable. No server-side runtime dependencies.
2. **Content-Driven**: Blog posts in Markdown with YAML frontmatter drive the site structure.
3. **SEO-Optimized**: Every page has proper meta tags, Open Graph, schema.org markup, and sitemap entries.
4. **Build-Time Rendering**: SSR is used during build (`prerender.mjs`), not at runtime.

### Project Structure

```
src/
  components/     - Reusable UI components (shadcn/ui style)
  content/        - Blog post Markdown files with YAML frontmatter
  data/           - JSON data files (articles.json, projects.json)
  hooks/          - Custom React hooks for data fetching
  lib/            - Shared utilities, SEO helpers, data adapters
  pages/          - Route-level page components
  scripts/        - Build scripts (prerender, SEO generation, etc.)
  static/         - Static assets (images, videos, favicon)
  types/          - TypeScript type definitions

docs/             - Build output (GitHub Pages deployment directory)
documentation/    - Development guides and reference docs
```

## Code Generation Guidelines

### When Writing Components

1. **Use TypeScript**: All components must be typed. Props should have explicit interfaces.
   ```typescript
   interface ArticleCardProps {
     title: string;
     description: string;
     date: string;
     slug: string;
     tags: string[];
   }
   ```

2. **Use shadcn/ui Patterns**: Import from `@/components/ui/*` for base components. Compose them into domain-specific components.
   ```typescript
   import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
   ```

3. **Accessibility First**: Include ARIA labels, semantic HTML, and keyboard navigation.
   ```typescript
   <button aria-label="Close dialog" onClick={handleClose}>
     <X className="h-4 w-4" />
   </button>
   ```

4. **SEO-Aware**: For page components, always include `<Seo>` component with appropriate props.
   ```typescript
   <Seo
     title="Blog Post Title"
     description="Meta description 120-160 chars"
     type="article"
     canonicalUrl={`https://markhazleton.github.io/mark-hazleton-s-notes/blog/${slug}`}
   />
   ```

### When Working with Content

1. **Blog Posts**: Create Markdown files in `src/content/` with YAML frontmatter:
   ```yaml
   ---
   title: "Article Title"
   date: "2026-01-21"
   description: "SEO-friendly description 120-160 characters"
   tags: ["React", "TypeScript", "Architecture"]
   author: "Mark Hazleton"
   ---
   ```

2. **Metadata Schema**: After adding/editing Markdown, run `npm run generate:articles` to update `src/data/articles.json`.

3. **Projects**: Edit `src/data/projects.json` directly. Follow existing schema:
   ```json
   {
     "id": "unique-slug",
     "title": "Project Name",
     "description": "Brief description",
     "technologies": ["React", "TypeScript"],
     "status": "active",
     "links": {
       "github": "https://github.com/...",
       "demo": "https://..."
     }
   }
   ```

### When Modifying Build Scripts

1. **Script Location**: All build scripts are in `src/scripts/`
2. **Execution Order**: Follow the order defined in `package.json` `build` script
3. **Environment Variables**: Use `VITE_BASE_PATH`, `VITE_SITE_URL`, `SITE_URL` for GitHub Pages paths
4. **Error Handling**: Scripts must exit with non-zero code on failure to prevent broken deployments

### When Adding Routes

1. **Define Route**: Add to `src/AppRoutes.tsx` using React Router v7 syntax
2. **Create Page Component**: In `src/pages/` with proper SEO component
3. **Update Prerender**: Add route to `src/scripts/prerender.mjs` route list
4. **Test Build**: Run `npm run build` to ensure prerendering succeeds

### When Writing Tests (Future)

- Currently no test suite exists
- If adding tests: Use Vitest (Vite-native)
- Prefer integration tests over unit tests for user-facing features
- Test SEO metadata generation, routing, and data transformations

## Common Tasks

### Adding a New Blog Post

1. Create `src/content/new-post-slug.md` with frontmatter
2. Run `npm run generate:articles`
3. Test locally: `npm run dev`
4. Commit and push (triggers deployment)

### Adding a New Project

1. Edit `src/data/projects.json`
2. Test locally: `npm run dev`
3. Commit and push

### Updating SEO Metadata

1. Modify `src/lib/seo/seoHelpers.ts` for global SEO config
2. Edit individual page components to update per-page metadata
3. Regenerate SEO assets: `npm run generate:seo`

### Debugging Build Issues

1. Check `npm run type-check` for TypeScript errors
2. Check `npm run lint` for ESLint errors
3. Run `npm run build` locally to reproduce CI environment
4. Verify `docs/.nojekyll` exists after build
5. Check `docs/index.html` was generated

## Important Constraints

### Do NOT

- ❌ Add server-side runtime dependencies (Express, Next.js API routes, etc.)
- ❌ Use `any` type in TypeScript (strict mode enforced)
- ❌ Hardcode URLs (use `VITE_BASE_PATH` and `VITE_SITE_URL` env vars)
- ❌ Break existing content routes (maintain backward compatibility)
- ❌ Add inline scripts to HTML (CSP-friendly architecture)
- ❌ Commit large binary files (optimize images, use external video hosting)

### Always

- ✅ Run `npm run type-check` before committing
- ✅ Include meta descriptions (120-160 chars) for all content pages
- ✅ Use semantic HTML (`<article>`, `<section>`, `<nav>`, etc.)
- ✅ Test accessibility (keyboard navigation, ARIA labels, color contrast)
- ✅ Update documentation when changing build process or architecture
- ✅ Maintain dual licensing (MIT for code, CC BY-NC 4.0 for content)

## Performance Targets

- Lighthouse Performance: 90+
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1
- Total Blocking Time: <200ms

## SEO Requirements Checklist

For every new page:

- [ ] Unique `<title>` tag (50-60 characters)
- [ ] Meta description (120-160 characters)
- [ ] Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`)
- [ ] Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
- [ ] Canonical URL (absolute, correct for GitHub Pages base path)
- [ ] Schema.org structured data (Article, Person, or Organization as appropriate)
- [ ] Proper heading hierarchy (single H1, logical H2-H6 structure)

## Accessibility Requirements

- Use semantic HTML elements (`<article>`, `<nav>`, `<main>`, `<aside>`)
- Include `alt` text for all images (descriptive, not decorative)
- Provide ARIA labels for icon-only buttons
- Ensure color contrast meets WCAG AA standards (4.5:1 for normal text)
- Support keyboard navigation (tab order, focus indicators)
- Test with screen reader preview tools

## Security Headers

Enforced via `staticwebapp.config.json`:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`: Restrictive (deny camera, geolocation, etc.)

## Useful Commands Reference

```bash
# Development
npm run dev                    # Start dev server (port 8080)
npm run type-check             # TypeScript validation
npm run lint                   # ESLint
npm run lint:fix               # Auto-fix lint errors

# Build
npm run build                  # Full production build
npm run build:ci               # CI build (uses cached YouTube data)
npm run build:docs             # GitHub Pages build with correct base path
npm run preview                # Preview production build

# Content Management
npm run generate:articles      # Parse Markdown → articles.json
npm run generate:seo           # Generate sitemap, robots.txt, feed
npm run generate:video-sitemap # Generate video sitemap
npm run fetch:youtube          # Update YouTube video cache

# Utilities
npm run clean                  # Remove docs/ directory
npm run prerender              # Prerender all routes to static HTML
npm run publish:docs           # Copy static assets to docs/
```

## Deployment Pipeline

**Trigger**: Push to `main` branch or manual workflow dispatch

**Steps** (see `.github/workflows/deploy.yml`):

1. Checkout code
2. Setup Node.js 20
3. `npm ci` (clean install)
4. `npm run build:ci` (full build with prerender)
5. Verify build output (`docs/index.html`, `docs/.nojekyll`)
6. Upload to GitHub Pages
7. Deploy

**Expected Duration**: 2-3 minutes

## Troubleshooting

### Build Fails with "Cannot find module"

- Run `npm ci` to ensure dependencies match `package-lock.json`
- Check TypeScript imports use `@/` alias correctly

### Prerender Script Fails

- Verify all routes in `src/scripts/prerender.mjs` are valid
- Check for runtime-only code (e.g., `window` access) in components used during SSR

### SEO Assets Missing

- Ensure `npm run generate:seo` runs after `prerender` in build pipeline
- Verify `SITE_URL` environment variable is set

### GitHub Pages 404

- Check `docs/.nojekyll` exists
- Verify `VITE_BASE_PATH` matches repository name
- Confirm routes use base path correctly

## Constitution Reference

For governance and architectural decisions, refer to [`.specify/memory/constitution.md`](../.specify/memory/constitution.md).

Key constitutional principles:

1. **Static-First Architecture**: No server runtime dependencies
2. **Content-First Development**: Content structure drives technical decisions
3. **SEO & Discoverability**: First-class concern, not afterthought
4. **Performance & Accessibility**: Lighthouse 90+, WCAG AA compliance
5. **Dual Licensing**: MIT for code, CC BY-NC 4.0 for content
6. **Automated Quality Gates**: CI must pass before deployment
7. **Documentation-Driven Development**: Document before implementing

## Contact & Context

**Author**: Mark Hazleton (Technical Solutions Architect)

**Content Focus**: Cloud architecture, .NET/Azure, AI/ML, integration patterns, software engineering practices

**Audience**: Technical professionals, potential collaborators, hiring managers

**Tone**: Professional but approachable, educational, detail-oriented

When suggesting content or features, keep Mark's voice and expertise in mind: deep technical knowledge, practical experience, emphasis on resilient systems and scalable architecture.
