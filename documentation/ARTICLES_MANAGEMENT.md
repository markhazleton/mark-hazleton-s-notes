# Articles Management - Quick Reference

## 📋 Overview

Your articles are now managed using **frontmatter in markdown files** instead of manually maintaining articles.json. The JSON file is automatically generated during the build process.

## 🚀 Quick Start

### Adding a New Article

1. **Copy the template:**
   ```bash
   cp src/content/_TEMPLATE.md src/content/my-new-article.md
   ```

2. **Edit the frontmatter** (between the `---` markers):
   - Update `id` to the next available number
   - Change `slug` to match your filename
   - Fill in `name`, `description`, `keywords`, etc.
   - Update `lastmod` and `publishedDate`
   - Choose a `Section` (e.g., "Leadership Philosophy", "Technology", "Azure")

3. **Write your content** below the second `---`

4. **Build** (articles.json generates automatically):
   ```bash
   npm run build
   ```

### Editing an Existing Article

1. **Open the markdown file** in `src/content/`
2. **Edit both frontmatter and content** as needed
3. **Build** to regenerate articles.json:
   ```bash
   npm run build
   ```

## 📝 Available Commands

```bash
# Generate articles.json from markdown files
npm run generate:articles

# Preview migration (doesn't modify files)
npm run migrate:frontmatter:dry-run

# Migrate existing markdown files to include frontmatter
npm run migrate:frontmatter

# Full build (includes article generation)
npm run build
```

## 📂 File Structure

```
src/
  content/
    _TEMPLATE.md           # Template for new articles
    article-name.md        # Your article files
  data/
    articles.json          # Auto-generated (DO NOT EDIT)
  scripts/
    generate-articles-json.mjs    # Generates articles.json
    migrate-to-frontmatter.mjs    # One-time migration tool
```

## 🔑 Key Frontmatter Fields

### Required
- `id` - Unique numeric identifier
- `Section` - Category (e.g., "Leadership Philosophy", "Technology")
- `slug` - URL slug (e.g., "my-article.html")
- `name` - Article title

### Important
- `description` - SEO description (150-160 chars)
- `keywords` - Comma-separated keywords
- `lastmod` - Last modified date (YYYY-MM-DD)
- `publishedDate` - Publication date (YYYY-MM-DD)
- `summary` - Longer summary for previews

### SEO Objects
- `seo.title` - SEO title
- `seo.description` - SEO description
- `seo.canonical` - Canonical URL
- `og.*` - Open Graph tags
- `twitter.*` - Twitter card tags

## 🎯 Common Sections

- "Leadership Philosophy"
- "Technology"
- "Azure"
- "Software Development"
- "Project Management"
- "Industry Insights"
- "Career Development"

## ⚡ Tips

1. **Never edit articles.json directly** - It's auto-generated
2. **Use the template** for consistency
3. **Keep IDs unique** and sequential
4. **Test locally** before committing
5. **Run generate:articles** to preview changes without full build

## 🔄 Migration from Old System

If you haven't migrated yet:

```bash
# See what would change
npm run migrate:frontmatter:dry-run

# Perform the migration
npm run migrate:frontmatter
```

This will:
- Add frontmatter to all markdown files
- Backup originals to `TEMP/markdown-backup/`
- Pull data from current articles.json

## 🆘 Troubleshooting

**Problem:** "No frontmatter found" warning
- **Solution:** Ensure `---` markers are at the very top of the file with no leading spaces

**Problem:** Article not appearing
- **Solution:** Check that the markdown file has a unique `id` and exists in `src/content/`

**Problem:** Wrong metadata showing
- **Solution:** Update the frontmatter in the markdown file and rebuild

**Problem:** Changes not reflecting
- **Solution:** Run `npm run generate:articles` or `npm run build`

## 📚 Additional Resources

- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Detailed migration guide
- [src/content/_TEMPLATE.md](src/content/_TEMPLATE.md) - New article template
- [src/scripts/generate-articles-json.mjs](src/scripts/generate-articles-json.mjs) - Generation script

## 💡 Benefits of This Approach

✅ **Single source of truth** - One file per article  
✅ **No duplication** - Metadata and content together  
✅ **Easier maintenance** - Edit one file instead of two  
✅ **Better version control** - Clear diffs in git  
✅ **Automatic generation** - No manual JSON updates  
✅ **Less error-prone** - Can't forget to update JSON  

---

**Need help?** Check the [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for more details.
