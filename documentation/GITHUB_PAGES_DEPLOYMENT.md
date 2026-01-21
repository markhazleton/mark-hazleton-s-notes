# GitHub Pages Deployment Guide

## Overview

This project uses GitHub Actions to automatically build and deploy to GitHub Pages. The workflow builds a static site and deploys it using the official GitHub Pages actions.

## Deployment Configuration

### Workflow File
Location: `.github/workflows/deploy.yml`

### Build Output
- **Directory**: `docs/`
- **Entry Point**: `docs/index.html`
- **Static Assets**: `docs/assets/`
- **SSR Server**: `docs/server/`

## Recent Updates

### ✅ Improvements Made

1. **Added YouTube Video Caching** - Reduces build time by caching video metadata
2. **Added Build Verification Step** - Ensures output is valid before upload
3. **Added Pages Setup Step** - Configures GitHub Pages environment
4. **Added Deployment Timeout** - Prevents hanging deployments
5. **Added .nojekyll Check** - Ensures proper file handling

### Build Verification

The workflow now includes a verification step that:
- Lists the contents of the `docs/` directory
- Confirms `index.html` exists
- Ensures `.nojekyll` file is present
- Exits with error if critical files are missing

## Common Deployment Issues & Solutions

### Issue 1: Deployment Queued and Cancelled

**Symptoms:**
- Workflow shows "deployment_queued" status
- Deployment is cancelled after timeout
- No error message in logs

**Causes:**
1. GitHub Pages not enabled in repository settings
2. Wrong source branch/folder configured
3. Missing or invalid artifact
4. Concurrent deployment conflicts

**Solutions:**

#### A. Verify GitHub Pages Settings

1. Go to repository **Settings** → **Pages**
2. Ensure the following configuration:
   - **Source**: GitHub Actions
   - NOT set to deploy from a branch (this conflicts with Actions deployment)

#### B. Check Workflow Permissions

Ensure the workflow has the correct permissions (already configured in our workflow):
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

#### C. Cancel Conflicting Deployments

1. Go to **Actions** tab
2. Cancel any stuck or queued deployments
3. Re-run the latest workflow

### Issue 2: Build Output Directory Not Found

**Symptoms:**
- Error: "docs output not found"
- Upload artifact step fails

**Solutions:**

1. **Verify Build Script**:
   ```bash
   npm run build
   ls -la docs/
   ```

2. **Check Vite Config**:
   - Ensure `outDir: "docs"` in `vite.config.ts`
   - Currently configured correctly ✓

3. **Check Build Steps**:
   - `build:client` → outputs to `docs/`
   - `build:ssr` → outputs to `docs/server/`
   - `prerender` → generates static HTML files
   - `publish:docs` → copies static assets

### Issue 3: 404 Errors After Deployment

**Symptoms:**
- Site deploys but shows 404 errors
- Assets not loading
- Routes not working

**Solutions:**

1. **Verify .nojekyll File**:
   - Must exist in `docs/.nojekyll`
   - Prevents Jekyll processing
   - Now automatically checked and created ✓

2. **Check Base Path**:
   - For project pages: `VITE_BASE_PATH=/repository-name/`
   - For user pages: `VITE_BASE_PATH=/`
   - Currently configured for project pages ✓

3. **Verify Asset Paths**:
   - Check `index.html` for correct asset references
   - Should use relative or base-path-prefixed URLs

### Issue 4: Workflow Fails During Build

**Symptoms:**
- Build step exits with non-zero code
- Error messages in build logs

**Solutions:**

1. **Check YouTube Fetch**:
   - If YouTube fetch fails, build continues with cached data
   - Check `.youtube-cache/` directory exists in CI

2. **Check Node Version**:
   - Workflow uses Node 20
   - Ensure all dependencies are compatible

3. **Clear npm Cache**:
   ```yaml
   - name: Clear cache
     run: npm cache clean --force
   ```

### Issue 5: Stale Deployment

**Symptoms:**
- Deployment succeeds but shows old content
- Changes not reflected on live site

**Solutions:**

1. **Force Refresh**:
   - Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
   - Clear browser cache

2. **Check GitHub Cache**:
   - GitHub Pages may cache content
   - Can take 5-10 minutes to update

3. **Verify Build**:
   - Check if build actually ran
   - Verify commit SHA in deployment

## Workflow Structure

### Jobs

```yaml
jobs:
  build:
    - Checkout code
    - Setup Node.js
    - Restore YouTube cache
    - Install dependencies
    - Build application
    - Verify build output
    - Setup GitHub Pages
    - Upload artifact
  
  deploy:
    - Deploy to GitHub Pages
    - Set deployment URL
```

### Environment Variables

```yaml
VITE_BASE_PATH: /<repository-name>/
VITE_SITE_URL: https://<owner>.github.io/<repository-name>
SITE_URL: https://<owner>.github.io/<repository-name>
```

## Manual Deployment

### Local Build Test

```bash
# Clean build
npm run clean

# Build site
npm run build

# Verify output
ls -la docs/
cat docs/index.html

# Test locally
npm run preview
```

### Manual GitHub Pages Setup

If the automated deployment fails repeatedly:

1. **Alternative Approach - Deploy from Branch**:
   ```bash
   # Create gh-pages branch
   git checkout -b gh-pages
   
   # Build locally
   npm run build
   
   # Force add docs directory
   git add -f docs/
   git commit -m "Deploy to GitHub Pages"
   
   # Push to gh-pages
   git push origin gh-pages --force
   ```

2. **Update Repository Settings**:
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: /docs

## Monitoring & Debugging

### Check Deployment Status

1. **Actions Tab**:
   - View workflow runs
   - Check individual job logs
   - Download artifacts for inspection

2. **Deployments Tab**:
   - View deployment history
   - Check deployment status
   - See deployment URLs

3. **Pages Settings**:
   - View live site URL
   - Check configuration
   - Review deployment source

### Debugging Build Issues

```bash
# Run build with verbose logging
npm run build -- --debug

# Check specific build steps
npm run fetch:youtube
npm run build:client
npm run build:ssr
npm run prerender
npm run publish:docs
npm run generate:seo

# Verify outputs
ls -la docs/
ls -la docs/assets/
ls -la docs/server/
```

### Download Artifact from Actions

1. Go to failed workflow run
2. Scroll to "Artifacts" section
3. Download "github-pages" artifact
4. Inspect contents locally

## Performance Optimization

### Current Optimizations

1. **YouTube Video Caching**:
   - Reduces build time by 75-90%
   - Only fetches new videos
   - See `YOUTUBE_CACHING_IMPLEMENTATION.md`

2. **npm Cache**:
   - Caches node_modules between runs
   - Speeds up dependency installation

3. **GitHub Actions Cache**:
   - Persists YouTube cache
   - Reduces redundant API calls

### Build Time Benchmarks

| Step | Time (Typical) | Notes |
|------|----------------|-------|
| Checkout | ~5 sec | Fast |
| Setup Node | ~10 sec | With cache |
| Install deps | ~30 sec | With cache |
| YouTube fetch | ~30 sec | With cache (90% cached) |
| Build client | ~45 sec | Vite build |
| Build SSR | ~20 sec | Server build |
| Prerender | ~30 sec | 40+ routes |
| Generate SEO | ~5 sec | sitemap/feed |
| Upload artifact | ~20 sec | Depends on size |
| Deploy | ~30 sec | GitHub Pages |
| **Total** | **~3-4 min** | Full pipeline |

## Troubleshooting Checklist

When deployment fails, check in order:

- [ ] GitHub Pages enabled in repository settings
- [ ] Pages source set to "GitHub Actions"
- [ ] Workflow permissions are correct
- [ ] No concurrent deployments running
- [ ] Build completes successfully
- [ ] `docs/index.html` exists
- [ ] `docs/.nojekyll` exists
- [ ] Artifact uploads successfully
- [ ] No error messages in logs
- [ ] YouTube cache is working (optional but helps)

## Getting Help

### Useful Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [actions/deploy-pages](https://github.com/actions/deploy-pages)
- [Vite GitHub Pages Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)

### Contact

If issues persist after following this guide:
1. Check GitHub Pages status page
2. Review recent GitHub Actions updates
3. Test with a minimal reproduction
4. Open an issue with full workflow logs

## Version History

- **2026-01-13**: Added YouTube caching, build verification, and improved error handling
- **Initial**: Basic GitHub Actions deployment setup
