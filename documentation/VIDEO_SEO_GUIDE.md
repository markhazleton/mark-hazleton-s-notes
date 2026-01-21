# Video SEO Guide - Getting Google to Index Your Videos

## Current Status: 0 Discovered Videos ❌

This guide will help you get Google to discover and index your YouTube videos on your website.

## What Was Fixed

### 1. ✅ Added VideoObject Structured Data
- Added JSON-LD structured data to the Videos page
- Uses schema.org VideoObject format
- Includes all required fields: name, description, thumbnailUrl, uploadDate, contentUrl, embedUrl
- Implements ItemList for multiple videos

### 2. ✅ Created Video Sitemap Generator
- New script at `src/scripts/generate-video-sitemap.ts`
- Generates Google-compliant video sitemap
- Includes video-specific metadata (duration, views, thumbnails)

## Required Actions

### Step 1: Update robots.txt

Add the video sitemap reference to your `docs/robots.txt`:

```txt
User-agent: *
Allow: /

Sitemap: https://markhazleton.com/sitemap.xml
Sitemap: https://markhazleton.com/video-sitemap.xml
```

### Step 2: Generate Video Sitemap

Run the video sitemap generator:

```bash
npm run generate:video-sitemap
```

This will create `docs/video-sitemap.xml` with all your videos.

### Step 3: Submit to Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property (markhazleton.com)
3. Navigate to **Sitemaps** in the left sidebar
4. Add new sitemap: `https://markhazleton.com/video-sitemap.xml`
5. Click Submit

### Step 4: Request Indexing for Video Page

1. In Google Search Console, go to **URL Inspection**
2. Enter: `https://markhazleton.com/videos`
3. Click "Request Indexing"
4. Wait 1-7 days for Google to crawl

### Step 5: Verify Structured Data

1. Go to [Rich Results Test](https://search.google.com/test/rich-results)
2. Enter: `https://markhazleton.com/videos`
3. Verify VideoObject appears
4. Check for any errors or warnings

## Understanding Google Video Discovery

### Why Videos Aren't Discovered

Google needs three things to discover videos:

1. **Proper Markup**: VideoObject structured data (✅ FIXED)
2. **Sitemap**: Video sitemap submitted to Search Console (⏳ NEEDS ACTION)
3. **Crawlability**: Robots.txt must allow Googlebot (✅ ALREADY WORKS)

### Timeline for Discovery

- **Immediate**: Structured data is now on the page
- **1-3 days**: After submitting video sitemap
- **7-14 days**: For videos to appear in Google Search results
- **30 days**: For full indexing and ranking

## Best Practices for Video SEO

### On-Page Optimization

1. **High-Quality Thumbnails**: ✅ Using YouTube maxresdefault
2. **Descriptive Titles**: Keep under 60 characters
3. **Detailed Descriptions**: Include keywords naturally
4. **Proper Schema**: ✅ VideoObject implemented
5. **Fast Loading**: ✅ Lazy loading images

### Content Strategy

1. **Create Individual Video Pages**: Consider dedicated pages per video
2. **Embed Videos**: Consider embedding videos directly
3. **Add Transcripts**: Great for SEO (future enhancement)
4. **Video Chapters**: Add timestamps in descriptions
5. **Related Content**: Link videos to relevant blog posts

### Technical Requirements

Google requires these VideoObject properties:

**Required:**
- ✅ name (title)
- ✅ description
- ✅ thumbnailUrl
- ✅ uploadDate (publishedAt)

**Recommended:**
- ✅ contentUrl or embedUrl
- ✅ duration
- publisher
- uploadDate

## Monitoring Progress

### Google Search Console

Check these reports weekly:

1. **Video Search Results**
   - Performance > Search Results > Search Appearance > Video
   - Shows impressions, clicks, CTR for video results

2. **Coverage Report**
   - Index > Coverage
   - Look for "Valid with warnings" or errors on video pages

3. **Enhancements**
   - Experience > Video
   - Shows structured data status

### Expected Metrics

After implementation:

- **Week 1**: Video sitemap indexed
- **Week 2**: Videos appear in "Videos" filter on Google
- **Week 3-4**: Videos appear in regular search results
- **Week 4+**: Video rich results (with thumbnails) in search

## Troubleshooting

### Videos Still Not Showing

1. **Check robots.txt**
   ```bash
   curl https://markhazleton.com/robots.txt
   ```

2. **Validate Structured Data**
   - Use [Schema Markup Validator](https://validator.schema.org/)
   - Enter video page URL
   - Fix any errors

3. **Check Indexing Status**
   - Search Google: `site:markhazleton.com videos`
   - Video page should appear

4. **Review Search Console**
   - Check for manual actions
   - Review security issues
   - Check mobile usability

### Common Issues

**Issue**: "Video sitemap submitted but videos not indexed"
**Solution**: Ensure VideoObject structured data is on the page

**Issue**: "Structured data detected but no videos in search"
**Solution**: Wait 2-4 weeks; Google processes video content slowly

**Issue**: "Videos appear but no thumbnail"
**Solution**: Verify thumbnailUrl is high-resolution (min 160x90px)

## Advanced Enhancements

### Consider These Improvements

1. **Individual Video Pages**
   - Create `/videos/:id` routes
   - Dedicated page per video
   - Better for SEO and user experience

2. **Video Embedding**
   - Embed YouTube videos directly
   - Increases time on page
   - Better user experience

3. **Video Transcripts**
   - Add video transcripts
   - Excellent for SEO
   - Improves accessibility

4. **Related Content**
   - Link videos to blog posts
   - Create playlists/categories
   - Cross-link related content

## Package.json Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "generate:video-sitemap": "tsx src/scripts/generate-video-sitemap.ts"
  }
}
```

## Useful Links

- [Google Video SEO Guide](https://developers.google.com/search/docs/appearance/video)
- [Video Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps)
- [VideoObject Structured Data](https://developers.google.com/search/docs/appearance/structured-data/video)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org VideoObject](https://schema.org/VideoObject)

## Summary

Your videos weren't discoverable because:
1. ❌ No VideoObject structured data
2. ❌ No video sitemap
3. ❌ Not submitted to Google Search Console

Now fixed:
1. ✅ VideoObject structured data added to Videos page
2. ✅ Video sitemap generator created
3. ⏳ Need to submit sitemap to Search Console

**Next Steps:**
1. Update robots.txt with video sitemap URL
2. Run `npm run generate:video-sitemap`
3. Submit video sitemap to Google Search Console
4. Request indexing for `/videos` page
5. Wait 1-2 weeks and monitor in Search Console

Within 2-4 weeks, you should see videos appearing in Google Search results! 🎉
