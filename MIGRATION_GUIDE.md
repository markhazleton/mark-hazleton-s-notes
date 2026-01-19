# Articles Migration Guide

## Overview

This guide explains how to migrate from maintaining both `articles.json` and separate markdown files to a **single-source approach** where all article metadata lives in the markdown files as frontmatter.

## Benefits

✅ **Single Source of Truth** - Each article is self-contained in one markdown file  
✅ **No Duplicate Entry** - Never manually edit articles.json again  
✅ **Easier Updates** - Change metadata and content in one place  
✅ **Better Version Control** - Git diffs show what actually changed  
✅ **Automatic Generation** - articles.json is built automatically  

## New Workflow

### Before (Old Way)
1. Edit markdown file content
2. Manually update articles.json with metadata
3. Keep both files in sync (error-prone!)

### After (New Way)
1. Edit ONE markdown file with frontmatter
2. Run build - articles.json generates automatically
3. Done! ✨

## Markdown File Format

Here's what your markdown files should look like with frontmatter:

```markdown
---
id: 1
Section: Leadership Philosophy
slug: sidetracked-by-sizzle.html
name: Not Sidetracked by Sizzle
description: Discover how to avoid being distracted by flashy technology and focus on delivering real business value.
keywords: technology leadership, business value, practical solutions, decision-making
img_src: /img/MarkHazleton.jpg
lastmod: 2024-01-15
publishedDate: 2024-01-15
estimatedReadTime: 5
changefreq: monthly
subtitle: Focusing on Substance Over Style
author: Mark Hazleton
summary: A philosophy on staying focused on practical solutions and business value rather than being distracted by flashy features.
seo:
  title: Not Sidetracked by Sizzle - Mark Hazleton
  description: Learn how to avoid being distracted by flashy technology and focus on delivering real business value.
  keywords: technology leadership, business value, practical solutions
  canonical: https://markhazleton.com/sidetracked-by-sizzle.html
  robots: index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1
og:
  title: Not Sidetracked by Sizzle
  description: A philosophy on staying focused on practical solutions and business value.
  type: article
  image: /img/MarkHazleton.jpg
  imageAlt: Mark Hazleton - Solutions Architect
twitter:
  title: Not Sidetracked by Sizzle
  description: A philosophy on staying focused on practical solutions and business value.
  image: /img/MarkHazleton.jpg
  imageAlt: Mark Hazleton - Solutions Architect
youtubeUrl: null
youtubeTitle: null
---

# Not Sidetracked by Sizzle

## What It Means

"Sidetracked by Sizzle" describes those moments when tech novelties...

[Rest of your markdown content...]
```

## Migration Steps

### Step 1: Update Build Scripts

Add the article generation script to your build process:

```json
{
  "scripts": {
    "build": "npm-run-all clean generate:articles build:client build:ssr prerender publish:docs generate:seo",
    "generate:articles": "node src/scripts/generate-articles-json.mjs"
  }
}
```

### Step 2: Add Frontmatter to Existing Files

You have two options:

**Option A: Automated Migration (Recommended)**
Run the migration script (see below) to automatically add frontmatter to all existing markdown files based on current articles.json data.

**Option B: Manual Migration**
For each markdown file:
1. Open the file
2. Look up its metadata in articles.json
3. Add the frontmatter block at the top
4. Save the file

### Step 3: Test the Generation

```bash
npm run generate:articles
```

This will create a new `articles.json` from your markdown files. Compare it with your current file to ensure accuracy.

### Step 4: Update Build Process

Once verified, the generation script will run automatically during your build process, so `articles.json` stays up-to-date.

### Step 5: Backup and Switch

1. Backup your current `articles.json`
2. Update your build scripts
3. Run a full build to test
4. Delete the backup once everything works

## Adding New Articles

### Old Way
1. Create markdown file
2. Add entry to articles.json
3. Remember to keep ID sequential

### New Way
1. Create markdown file with frontmatter
2. Run build (articles.json updates automatically)
3. Done!

## Tips

- **IDs**: Make sure each article has a unique ID in frontmatter
- **Required Fields**: At minimum, include: `id`, `name`, `slug`, `Section`
- **Validation**: The script will warn about missing frontmatter
- **Formatting**: Use proper YAML syntax for nested objects (indent with spaces)
- **Defaults**: The script provides sensible defaults for missing optional fields

## Troubleshooting

**"No frontmatter found" warning**
- Check that your frontmatter block starts and ends with `---`
- Ensure there's no space before the opening `---`
- The frontmatter must be at the very top of the file

**Missing fields in generated JSON**
- Add the field to your markdown frontmatter
- Run the generation script again

**IDs out of order**
- The generation script automatically sorts by ID
- Just make sure each article has a unique ID

## Next Steps

Want me to:
1. Create a migration script to automatically add frontmatter to existing files?
2. Update your package.json with the new build steps?
3. Create a template for new articles?

Let me know what you'd like to do next!
