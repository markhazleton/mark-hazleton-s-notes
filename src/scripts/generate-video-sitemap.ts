import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { sortedYoutubeVideos } from '../lib/data/youtube-videos';
import { posts } from '../lib/data/posts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate a video sitemap for Google Search Console
 * This helps Google discover and index your videos on both:
 * 1. The /videos page (YouTube channel videos)
 * 2. Blog articles with embedded videos
 * 
 * References:
 * - https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps
 * - https://developers.google.com/search/docs/appearance/structured-data/video
 */
asyncHelper to extract video ID from YouTube URL
  const extractVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
  };

  // Create video sitemap entries for YouTube channel videos
  const channelVideoEntries = sortedYoutubeVideos.map(video => `  <url>
    <loc>${siteUrl}/videos</loc>
    <video:video>
      <video:thumbnail_loc>${escapeXml(video.thumbnailUrl)}</video:thumbnail_loc>
      <video:title>${escapeXml(video.title)}</video:title>
      <video:description>${escapeXml(video.description || '')}</video:description>
      <video:content_loc>${escapeXml(video.videoUrl)}</video:content_loc>
      <video:player_loc>${escapeXml(`https://www.youtube.com/embed/${video.id}`)}</video:player_loc>
      <video:publication_date>${video.publishedAt}</video:publication_date>
      ${video.duration ? `<video:duration>${video.duration}</video:duration>` : ''}
      ${video.viewCount ? `<video:view_count>${video.viewCount}</video:view_count>` : ''}
      <video:uploader info="${siteUrl}">Mark Hazleton</video:uploader>
      <video:family_friendly>yes</video:family_friendly>
      <video:requires_subscription>no</video:requires_subscription>
    </video:video>
  </url>`);

  // Create video sitemap entries for blog posts with videos
  const blogVideoEntries = postsWithVideos.map(post => {
    const videoId = extractVideoId(post.youtubeUrl);
    if (!videoId) Channel videos: ${sortedYoutubeVideos.length}`);
  console.log(`   Blog post videos: ${postsWithVideos.length}`);
  console.log(`   Total video entries: ${allEntries.length}`);
  
  console.log('\n📝 Video sitemap already in robots.txt:');
  console.log(`Sitemap: ${siteUrl}/video-sitemap.xml`);
  
  console.log('\n🎯 Next steps:');
  console.log('1. Rebuild your site: npm run build');
  console.log('2. Deploy to production');
  console.log('3. Submit video sitemap in Google Search Console');
  console.log('4. Wait 1-2 weeks for Google to index videos'
      <video:thumbnail_loc>${escapeXml(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`)}</video:thumbnail_loc>
      <video:title>${escapeXml(post.youtubeTitle || post.title)}</video:title>
      <video:description>${escapeXml(post.excerpt)}</video:description>
      <video:content_loc>${escapeXml(post.youtubeUrl)}</video:content_loc>
      <video:player_loc>${escapeXml(`https://www.youtube.com/embed/${videoId}`)}</video:player_loc>
      <video:publication_date>${post.date}</video:publication_date>
      <video:uploader info="${siteUrl}">Mark Hazleton</video:uploader>
      <video:family_friendly>yes</video:family_friendly>
      <video:requires_subscription>no</video:requires_subscription>
    </video:video>
  </url>`;
  }).filter(Boolean);

  // Combine all entries
  const allEntries = [...channelVideoEntries, ...blogVideoEntries];
  
  // Create video sitemap XML
  const videoSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allEntrieseo:content_loc>${escapeXml(video.videoUrl)}</video:content_loc>
      <video:player_loc>${escapeXml(`https://www.youtube.com/embed/${video.id}`)}</video:player_loc>
      <video:publication_date>${video.publishedAt}</video:publication_date>
      ${video.duration ? `<video:duration>${video.duration}</video:duration>` : ''}
      ${video.viewCount ? `<video:view_count>${video.viewCount}</video:view_count>` : ''}
      <video:uploader info="${siteUrl}">${escapeXml(video.channelTitle)}</video:uploader>
      <video:family_friendly>yes</video:family_friendly>
      <video:requires_subscription>no</video:requires_subscription>
    </video:video>
  </url>`).join('\n')}
</urlset>`;

  // Write to docs directory
  const outputPath = path.join(__dirname, '../../docs/video-sitemap.xml');
  await fs.writeFile(outputPath, videoSitemap, 'utf-8');
  
  console.log(`✅ Video sitemap generated: ${outputPath}`);
  console.log(`   Videos included: ${sortedYoutubeVideos.length}`);
  
  // Generate robots.txt entry suggestion
  console.log('\n📝 Add this to your robots.txt:');
  console.log(`Sitemap: ${siteUrl}/video-sitemap.xml`);
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Run the script
generateVideoSitemap().catch(console.error);
