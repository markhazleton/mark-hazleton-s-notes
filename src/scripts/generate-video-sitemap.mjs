#!/usr/bin/env node

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

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateVideoSitemap() {
  const siteUrl = process.env.VITE_SITE_URL || 'https://markhazleton.github.io/mark-hazleton-s-notes';
  
  // Load data files directly
  const articlesPath = path.join(__dirname, '../data/articles.json');
  const videosPath = path.join(__dirname, '../data/youtube-videos.json');
  
  const articlesData = JSON.parse(await fs.readFile(articlesPath, 'utf-8'));
  const videosJson = JSON.parse(await fs.readFile(videosPath, 'utf-8'));
  const videosData = videosJson.videos || [];
  
  // Filter posts that have YouTube videos
  const postsWithVideos = articlesData.filter(post => post.youtubeUrl);
  
  console.log(`Found ${postsWithVideos.length} blog posts with videos`);
  console.log(`Found ${videosData.length} channel videos`);
  
  // Helper to extract video ID from YouTube URL
  const extractVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
  };

  // Helper to escape XML
  const escapeXml = (unsafe) => {
    if (!unsafe) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  // Create video sitemap entries for YouTube channel videos
  const channelVideoEntries = videosData.map(video => `  <url>
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
      <video:uploader info="${siteUrl}">${escapeXml(video.channelTitle || 'Mark Hazleton')}</video:uploader>
      <video:family_friendly>yes</video:family_friendly>
      <video:requires_subscription>no</video:requires_subscription>
    </video:video>
  </url>`);

  // Create video sitemap entries for blog posts with videos
  const blogVideoEntries = postsWithVideos.map(post => {
    const videoId = extractVideoId(post.youtubeUrl);
    if (!videoId) return null;
    
    return `  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <video:video>
      <video:thumbnail_loc>${escapeXml(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`)}</video:thumbnail_loc>
      <video:title>${escapeXml(post.youtubeTitle || post.name || post.title)}</video:title>
      <video:description>${escapeXml(post.description || post.summary || '')}</video:description>
      <video:content_loc>${escapeXml(post.youtubeUrl)}</video:content_loc>
      <video:player_loc>${escapeXml(`https://www.youtube.com/embed/${videoId}`)}</video:player_loc>
      <video:publication_date>${post.publishedDate || post.date}</video:publication_date>
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
${allEntries.join('\n')}
</urlset>`;

  // Write to docs directory
  const outputPath = path.join(__dirname, '../../docs/video-sitemap.xml');
  await fs.writeFile(outputPath, videoSitemap, 'utf-8');
  
  console.log(`\n✅ Video sitemap generated: ${outputPath}`);
  console.log(`   Channel videos: ${videosData.length}`);
  console.log(`   Blog post videos: ${postsWithVideos.length}`);
  console.log(`   Total video entries: ${allEntries.length}`);
  
  console.log('\n📝 Video sitemap already in robots.txt:');
  console.log(`Sitemap: ${siteUrl}/video-sitemap.xml`);
  
  console.log('\n🎯 Next steps:');
  console.log('1. Run: npm run dev (to test locally)');
  console.log('2. Build: npm run build');
  console.log('3. Deploy to production');
  console.log('4. Submit video sitemap in Google Search Console');
  console.log('5. Wait 1-2 weeks for Google to index videos');
}

// Run the script
generateVideoSitemap().catch(console.error);
