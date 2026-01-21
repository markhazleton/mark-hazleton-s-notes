# Adding YouTube Videos to Blog Articles

## Quick Start

To add a YouTube video to any blog article, simply update the frontmatter:

```yaml
---
youtubeUrl: https://www.youtube.com/watch?v=VIDEO_ID
youtubeTitle: "Your Video Title"
---
```

That's it! The video will automatically appear below the article header.

## How It Works

### 1. YouTubeEmbed Component

The `YouTubeEmbed` component provides:
- **Lazy loading**: Shows thumbnail preview, only loads iframe when clicked
- **Responsive design**: 16:9 aspect ratio that works on all devices
- **Performance**: Doesn't load heavy YouTube iframe until user interaction
- **SEO**: Includes VideoObject structured data for Google

### 2. Automatic Integration

When you add YouTube URL to frontmatter:
1. Video thumbnail displays after article header
2. User clicks to play (lazy load)
3. VideoObject schema added for SEO
4. "Watch on YouTube" link included

### 3. SEO Benefits

Videos with proper markup get:
- Featured in Google Video Search
- Rich snippets in search results
- Video thumbnails in search
- Better engagement metrics

## Example Article

See the ArtSpark article for a working example:
`src/content/building-artspark-where-ai-meets-art-history.md`

```yaml
---
youtubeUrl: https://www.youtube.com/watch?v=fXy1DSW2ee0
youtubeTitle: "Deep Dive: WebSpark.ArtSpark"
---
```

## Adding Videos to Existing Articles

1. **Find your article** in `src/content/`
2. **Add frontmatter fields**:
   ```yaml
   youtubeUrl: https://www.youtube.com/watch?v=YOUR_VIDEO_ID
   youtubeTitle: "Your Video Title"
   ```
3. **Rebuild the site**:
   ```bash
   npm run generate:articles
   npm run build
   ```

## Video Formats Supported

The system supports these YouTube URL formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`

## Styling

The video embed:
- Full width on mobile
- Max-width on desktop
- Smooth animations
- Matches site theme
- Shadow and hover effects

## Performance

The lazy-loading approach:
- Initial page load: Just thumbnail image (~50KB)
- After click: Full YouTube iframe (~500KB+)
- Saves bandwidth for users who don't watch
- Faster initial page load

## SEO Impact

Adding videos to articles improves:
1. **Time on page**: Users stay longer
2. **Engagement**: Video views tracked
3. **Search visibility**: Video rich results
4. **Backlinks**: YouTube description can link back
5. **Social shares**: Videos increase shareability

## Best Practices

### Video Titles
- Keep under 60 characters
- Include primary keyword
- Make it descriptive
- Match article topic

### Video Descriptions (on YouTube)
- First 150 characters are most important
- Include link back to article
- Add timestamps for chapters
- Use relevant keywords

### Thumbnails
- Use custom thumbnails on YouTube
- High contrast, readable text
- Consistent branding
- 1280x720 resolution

## Future Enhancements

Possible additions:
1. **Video chapters**: Add timeline markers
2. **Playlists**: Group related videos
3. **Transcripts**: Include full transcripts for SEO
4. **Video series**: Link videos in sequence
5. **Auto-suggest**: Recommend related videos

## Troubleshooting

### Video not showing?
1. Check frontmatter syntax (valid YAML)
2. Run `npm run generate:articles`
3. Rebuild with `npm run build`
4. Clear browser cache

### Wrong video?
1. Verify video ID in URL
2. Check YouTube video is public (not private/unlisted)
3. Test URL in browser first

### Styling issues?
1. Component uses Tailwind classes
2. Check `YouTubeEmbed.tsx` for customization
3. Aspect ratio is 16:9 by default

## Example Workflow

1. **Create/publish YouTube video**
2. **Copy video URL**
3. **Open article markdown file**
4. **Add to frontmatter**:
   ```yaml
   youtubeUrl: https://www.youtube.com/watch?v=abc123
   youtubeTitle: "My Video Title"
   ```
5. **Regenerate articles**:
   ```bash
   npm run generate:articles
   ```
6. **Build and deploy**:
   ```bash
   npm run build
   ```

## Multiple Videos?

For articles with multiple videos:
- Add primary video to frontmatter (shows at top)
- Embed others in markdown content using:
  ```markdown
  [![Video Title](https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg)](https://youtube.com/watch?v=VIDEO_ID)
  ```

## Analytics

Track video performance:
1. **YouTube Analytics**: Views, watch time, engagement
2. **Google Analytics**: Time on page, bounce rate
3. **Google Search Console**: Video impressions, clicks

## Summary

You now have a complete video integration system that:
- ✅ Automatically embeds videos in articles
- ✅ Lazy loads for performance
- ✅ Adds SEO structured data
- ✅ Works responsively on all devices
- ✅ Matches your site's design

Just add `youtubeUrl` to frontmatter and rebuild!
