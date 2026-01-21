<!--
Sync Impact Report:
Version: 1.0.0 (Initial Constitution)
Modified Principles: All (initial creation)
Added Sections: Core Principles, Technical Standards, Content Standards, Development Workflow, Security & Privacy, Governance
Templates Status:
  ✅ plan-template.md - Reviewed, aligns with constitution
  ✅ spec-template.md - Reviewed, aligns with constitution
  ✅ tasks-template.md - Reviewed, aligns with constitution
Follow-up TODOs: None
-->

# Mark Hazleton's Notes - Project Constitution

## Core Principles

### I. Static-First Architecture

The site MUST be deployable as a static site without server-side dependencies.

**Rules**:
- All content MUST be prerenderable to static HTML at build time
- Client-side hydration is acceptable for progressive enhancement
- External API calls (e.g., GitHub stats) MUST be inlined during prerendering
- Build output MUST be self-contained in the `docs/` directory for GitHub Pages deployment

**Rationale**: GitHub Pages deployment requires static artifacts. SSR is used only during build, not at runtime. This ensures maximum reliability, performance, and zero-cost hosting.

### II. Content-First Development

Content and its structure MUST drive technical decisions, not the reverse.

**Rules**:
- Blog posts are authored in Markdown with YAML frontmatter for metadata
- Metadata schemas (articles.json, projects.json) MUST be the source of truth for content organization
- New features MUST NOT break existing content or require retroactive content migration
- Content files MUST be human-readable and editable without technical tools

**Rationale**: The site exists to publish Mark Hazleton's technical writing and projects. Technical complexity that makes content authorship harder is counterproductive.

### III. SEO & Discoverability as First-Class Concerns

Every page MUST be optimized for search engines and social sharing.

**Rules**:
- All articles MUST have unique meta descriptions, titles, and Open Graph tags
- Canonical URLs MUST be explicit and correct for all routes
- `sitemap.xml`, `robots.txt`, and RSS feed MUST be automatically generated
- Schema.org structured data (Article, Person, Organization) MUST be included where appropriate
- Video content MUST have video sitemaps with complete metadata

**Rationale**: Discoverability determines reach. The site's value comes from readers finding and consuming content. SEO is not optional.

### IV. Performance & Accessibility

The site MUST be fast and accessible to all users.

**Rules**:
- Lighthouse Performance score MUST be 90+ on production builds
- All interactive elements MUST have appropriate ARIA labels
- Images MUST have descriptive alt text
- Color contrast MUST meet WCAG AA standards
- Core Web Vitals (LCP, FID, CLS) MUST be within "Good" thresholds
- JavaScript bundle size MUST be monitored and kept minimal

**Rationale**: Performance affects SEO rankings and user retention. Accessibility is both a legal requirement and a moral imperative.

### V. Dual Licensing: Code vs Content

Code and content MUST be licensed separately to reflect their different purposes.

**Rules**:
- **Code** (source, build scripts, configuration): MIT License
- **Content** (blog posts, project descriptions, prose): CC BY-NC 4.0
- LICENSE files MUST be present in repository root: `LICENSE` (MIT) and `LICENSE-CONTENT` (CC BY-NC 4.0)
- All new code contributions default to MIT
- All new content contributions default to CC BY-NC 4.0

**Rationale**: Code is meant to be reused and adapted freely. Content is Mark's intellectual property intended for non-commercial sharing with attribution.

### VI. Automated Quality Gates

All deployments MUST pass automated validation before going live.

**Rules**:
- Build MUST succeed without errors or warnings
- TypeScript type checking MUST pass (`npm run type-check`)
- ESLint MUST pass without errors (`npm run lint`)
- Prerender script MUST generate all expected HTML files
- SEO assets (sitemap, feed, robots.txt) MUST be generated
- `.nojekyll` file MUST be present in build output

**Rationale**: Manual verification doesn't scale. Automated gates prevent regressions and deployment failures.

### VII. Documentation-Driven Development

Changes to build process, content schemas, or deployment MUST be documented before implementation.

**Rules**:
- New features MUST update relevant documentation in `documentation/`
- Breaking changes to schemas or APIs MUST include migration guides
- README MUST remain the single source of truth for project setup and architecture
- Build scripts MUST have inline comments explaining their purpose

**Rationale**: Future maintainers (including future Mark) need to understand why decisions were made. Documentation is insurance against knowledge loss.

## Technical Standards

### Stack & Frameworks

- **Frontend**: React 19 + React Router 7 (no exceptions without constitutional amendment)
- **Build Tool**: Vite 7 with SSR and static prerendering
- **Styling**: Tailwind CSS 4 + shadcn/ui + Radix UI primitives
- **TypeScript**: Strict mode enabled; no `any` types except in migration scenarios
- **Markdown**: React Markdown with remark-gfm for GitHub Flavored Markdown support

### Build & Deployment Pipeline

**Build Process Order** (enforced by `package.json` scripts):

1. **Clean**: Remove `docs/` directory
2. **Generate Build Info**: Timestamp and version metadata
3. **Generate Articles**: Parse Markdown frontmatter → `articles.json`
4. **Build Client**: Vite client bundle
5. **Build SSR**: Vite SSR bundle for prerendering
6. **Prerender**: Generate static HTML for all routes
7. **Publish Docs**: Copy static assets (`src/static`) to `docs/`
8. **Generate SEO**: Create `sitemap.xml`, `robots.txt`, `feed.xml`
9. **Generate Video Sitemap**: Create video sitemap from YouTube data

**Environment Variables**:

- `VITE_BASE_PATH`: Base path for GitHub Pages (e.g., `/mark-hazleton-s-notes/`)
- `VITE_SITE_URL`: Canonical site URL (e.g., `https://markhazleton.github.io/mark-hazleton-s-notes`)
- `SITE_URL`: Used by SEO scripts (defaults to `VITE_SITE_URL`)

**Deployment Target**: GitHub Pages via GitHub Actions (Node.js 20)

### Code Quality Standards

- **Linting**: ESLint with React and TypeScript plugins
- **Formatting**: No specific formatter enforced (Prettier optional)
- **Type Safety**: All TypeScript errors MUST be resolved before commit
- **Component Structure**: Prefer composition over inheritance; keep components small and focused
- **State Management**: React Context + TanStack Query for server state

## Content Standards

### Blog Post Requirements

Every blog post MUST:

1. Be authored in Markdown with YAML frontmatter
2. Include at minimum: `title`, `date`, `description`, `tags`, `author`
3. Have a unique slug derived from filename
4. Be registered in `src/data/articles.json` (auto-generated from frontmatter)
5. Have at least one descriptive tag for categorization
6. Have a meta description between 120-160 characters
7. Use semantic HTML headings (H1 for title, H2 for sections, etc.)

### Project Requirements

Every project entry MUST:

1. Be defined in `src/data/projects.json`
2. Include: `title`, `description`, `technologies`, `status`, `links`
3. Have a dedicated route under `/projects/:slug`
4. Include screenshots or demo links where applicable
5. Declare technology stack explicitly

### Media Assets

- **Images**: Store in `src/static/img/`, optimize for web (<500KB per image)
- **Videos**: Prefer YouTube embeds over self-hosted; use `YouTubeEmbed` component
- **Thumbnails**: YouTube maxresdefault preferred; include alt text

## Development Workflow

### Local Development

```bash
npm install         # Install dependencies
npm run dev         # Start dev server on http://localhost:8080
npm run type-check  # Validate TypeScript
npm run lint        # Run ESLint
npm run build       # Full production build
```

### Adding Content

**New Blog Post**:

1. Create `src/content/[slug].md` with YAML frontmatter
2. Run `npm run generate:articles` to update `articles.json`
3. Test locally with `npm run dev`
4. Commit and push to trigger deployment

**New Project**:

1. Add entry to `src/data/projects.json`
2. Test locally
3. Commit and push

### Pull Request Requirements

All PRs MUST:

- Pass CI checks (build, type-check, lint)
- Update relevant documentation if changing architecture or APIs
- Include clear description of changes and rationale
- Not break existing content or routes

### Deployment Process

**Automated via GitHub Actions** (`.github/workflows/deploy.yml`):

- Trigger: Push to `main` branch or manual workflow dispatch
- Node.js version: 20 (matches local development)
- Build command: `npm run build:ci` (uses existing YouTube cache)
- Output: `docs/` directory uploaded to GitHub Pages
- Timeout: 10 minutes for deployment step

## Security & Privacy

### Security Headers

`staticwebapp.config.json` MUST enforce:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`: Restrictive (deny accelerometer, camera, geolocation, etc.)

### External Dependencies

- External API calls (GitHub stats) MUST be over HTTPS
- No third-party analytics or tracking scripts without explicit disclosure
- YouTube embeds MUST use `youtube-nocookie.com` domain where possible

### Content Security

- No user-generated content (comments, forms, etc.) without moderation system
- No inline scripts in HTML (CSP-friendly architecture)
- No storage of sensitive data (credentials, API keys) in repository

## Governance

### Amendment Process

This constitution MUST be amended when:

1. **Major Change** (v2.0.0): Introducing backward-incompatible requirements (e.g., migrating from React to another framework)
2. **Minor Change** (v1.1.0): Adding new principles or expanding existing ones materially (e.g., adding internationalization requirements)
3. **Patch Change** (v1.0.1): Clarifications, typo fixes, non-semantic refinements

**Amendment Steps**:

1. Propose change in issue or PR with rationale
2. Update this constitution file with version bump and `LAST_AMENDED_DATE`
3. Update `Sync Impact Report` (HTML comment at top of file)
4. Review and update all dependent templates and documentation
5. Merge after approval

### Compliance Verification

All PRs and code reviews MUST verify:

- No violations of core principles
- SEO requirements met for new content
- Security headers remain enforced
- Build process integrity maintained

### Versioning Policy

- **Version Format**: MAJOR.MINOR.PATCH (semantic versioning)
- **MAJOR**: Backward-incompatible governance changes
- **MINOR**: New principles or material expansions
- **PATCH**: Clarifications and refinements

### Complexity Justification

Any deviation from simplicity or introduction of new architectural layers MUST be justified:

- Why is the added complexity necessary?
- What simpler alternative was rejected and why?
- What is the maintenance cost?
- Document in `documentation/` before implementation

### Specification Template Alignment

The templates in `.specify/templates/` MUST remain aligned with this constitution:

- **spec-template.md**: User stories MUST be independently testable (Principle II)
- **plan-template.md**: Technical context MUST include performance goals (Principle IV)
- **tasks-template.md**: Tasks MUST be organized by user story for incremental delivery

---

**Version**: 1.0.0 | **Ratified**: 2026-01-21 | **Last Amended**: 2026-01-21
