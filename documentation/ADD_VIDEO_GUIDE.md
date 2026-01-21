# Add Video to Blog Article - Quick Guide

## Usage

Run the interactive script:

```bash
npm run add:video
```

## What It Does

The script will:

1. **Prompt for YouTube URL**
   - Accepts any YouTube URL format
   - Extracts video ID automatically
   - Fetches video title from YouTube

2. **Select Blog Article**
   - Shows list of all markdown files
   - Select by number or filename

3. **Confirm Video Title**
   - Auto-fills from YouTube metadata
   - Edit if needed

4. **Update Article**
   - Adds `youtubeUrl` to frontmatter
   - Adds `youtubeTitle` to frontmatter
   - Creates backup of original file
   - Saves updated article

5. **Regenerate Assets**
   - Updates `articles.json`
   - Updates `video-sitemap.xml`
   - Prompts to run build

## Example Session

```bash
$ npm run add:video

🎥 Add YouTube Video to Blog Article

📺 Step 1: YouTube Video
Enter YouTube video URL: https://www.youtube.com/watch?v=fXy1DSW2ee0
✓ Video ID: fXy1DSW2ee0
Fetching video metadata...
✓ Video Title: Deep Dive: WebSpark.ArtSpark

📝 Step 2: Select Blog Article
Available articles:
  1. building-artspark-where-ai-meets-art-history.md
  2. another-article.md
  ...

Enter article number (or filename): 1
✓ Selected: building-artspark-where-ai-meets-art-history.md

🏷️  Step 3: Video Title
Video title [Deep Dive: WebSpark.ArtSpark]: 
✓ Title: Deep Dive: WebSpark.ArtSpark

✍️  Step 4: Updating Article
✓ Backup created: building-artspark-where-ai-meets-art-history.md.backup
✓ Article updated: building-artspark-where-ai-meets-art-history.md

🔄 Step 5: Regenerate SEO Assets
Regenerate now? (y/n): y

⚙️  Regenerating assets...
Running: npm run generate:articles
✅ Successfully generated articles.json

Running: npm run generate:video-sitemap
✅ Video sitemap generated

✅ Done! Video has been added to your article.
```

## What Gets Updated

### Article Frontmatter

Before:
```yaml
---
title: My Article
youtubeUrl: null
youtubeTitle: null
---
```

After:
```yaml
---
title: My Article
youtubeUrl: https://www.youtube.com/watch?v=fXy1DSW2ee0
youtubeTitle: "Deep Dive: WebSpark.ArtSpark"
---
```

### Article Page

- Video embed appears at top of article
- VideoObject structured data added
- Lazy loading enabled

### Video Sitemap

New entry added:
```xml
<url>
  <loc>https://markhazleton.com/blog/your-article</loc>
  <video:video>
    <video:title>Deep Dive: WebSpark.ArtSpark</video:title>
    <video:description>Article excerpt</video:description>
    <video:thumbnail_loc>YouTube thumbnail</video:thumbnail_loc>
    <video:player_loc>Embed URL</video:player_loc>
  </video:video>
</url>
```

## After Running Script

1. **Review Changes**
   ```bash
   git diff src/content/
   ```

2. **Build Site**
   ```bash
   npm run build
   ```

3. **Test Locally**
   ```bash
   npm run dev
   # Visit: http://localhost:8080/blog/your-article
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Add video to article"
   git push
   ```

5. **Verify SEO**
   - Check video sitemap: `https://yoursite.com/video-sitemap.xml`
   - Test Rich Results: https://search.google.com/test/rich-results
   - Check Google Search Console after 1-2 weeks

## Backup Files

The script creates `.backup` files before making changes:

```bash
# If something goes wrong, restore from backup:
cp article.md.backup article.md

# Clean up backup files when satisfied:
rm src/content/*.backup
```

## Supported URL Formats

The script accepts any YouTube URL format:

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/v/VIDEO_ID`

## Error Handling

### Invalid YouTube URL
```
❌ Invalid YouTube URL
```
→ Use a valid YouTube link

### Video Not Found
```
⚠️  Could not fetch video metadata (will prompt for title)
```
→ Video might be private/unlisted, enter title manually

### Article Not Found
```
❌ File not found
```
→ Check filename spelling and `.md` extension

### No Frontmatter
```
❌ No frontmatter found in article
```
→ Article needs YAML frontmatter between `---` markers

## Advanced Usage

### Skip Regeneration

Answer 'n' when prompted, then run manually later:

```bash
npm run generate:articles
npm run generate:video-sitemap
npm run build
```

### Batch Processing

For multiple articles, run the script multiple times:

```bash
npm run add:video  # Article 1
npm run add:video  # Article 2
npm run add:video  # Article 3
npm run build      # Regenerate all at once
```

### Customize Video Title

The script auto-fetches from YouTube, but you can override:

```
Video title [Auto-fetched Title]: My Custom Title
```

## Troubleshooting

### Script Won't Run

Make sure Node.js is installed:
```bash
node --version  # Should be v18 or higher
```

### Permission Denied

On Unix/Linux/Mac:
```bash
chmod +x src/scripts/add-video-to-article.mjs
```

### Changes Not Appearing

1. Clear build cache:
   ```bash
   npm run clean
   npm run build
   ```

2. Check frontmatter syntax:
   ```bash
   cat src/content/your-article.md
   ```

3. Verify articles.json:
   ```bash
   cat src/data/articles.json | grep youtubeUrl
   ```

## Integration with Workflow

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b add-video-to-article

# 2. Add video
npm run add:video

# 3. Review changes
git diff

# 4. Commit
git add src/content/ src/data/
git commit -m "Add YouTube video to article"

# 5. Build and test
npm run build
npm run dev

# 6. Push and deploy
git push origin add-video-to-article
```

### CI/CD Integration

The script runs locally, but regenerated files commit to repo:

```yaml
# .github/workflows/deploy.yml
- name: Build
  run: |
    npm run generate:articles
    npm run generate:video-sitemap
    npm run build
```

## Summary

✅ **Interactive CLI tool**  
✅ **Auto-fetches video metadata**  
✅ **Updates frontmatter automatically**  
✅ **Creates backups**  
✅ **Regenerates SEO assets**  
✅ **Google video indexing ready**

Just run `npm run add:video` and follow the prompts!
