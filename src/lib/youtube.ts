import type { YouTubeVideo } from '@/types/youtube';

const YOUTUBE_RSS_BASE_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=';

/**
 * Fetches and parses YouTube RSS feed for a given channel
 * Uses allOrigins CORS proxy to bypass browser CORS restrictions
 * @param channelId - YouTube channel ID (e.g., 'UCI6K_ESpwCMJI5-qUiCGdng')
 * @returns Array of YouTube videos
 */
export async function fetchYouTubeVideos(
  channelId: string,
  signal?: AbortSignal
): Promise<YouTubeVideo[]> {
  const feedUrl = `${YOUTUBE_RSS_BASE_URL}${channelId}`;

  // Use allOrigins CORS proxy to fetch the feed
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;

  try {
    const response = await fetch(proxyUrl, {
      signal,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch YouTube feed: ${response.statusText}`);
    }

    const xmlText = await response.text();
    return parseYouTubeFeed(xmlText);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    throw new Error(
      `Error fetching YouTube videos: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Parses YouTube Atom feed XML into structured video data
 * @param xmlText - Raw XML string from YouTube RSS feed
 * @returns Array of parsed YouTube videos
 */
function parseYouTubeFeed(xmlText: string): YouTubeVideo[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

  // Check for parsing errors
  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Failed to parse YouTube feed XML');
  }

  const entries = xmlDoc.querySelectorAll('entry');
  const videos: YouTubeVideo[] = [];

  entries.forEach((entry) => {
    try {
      // Extract video ID - try yt:videoId first, fallback to link href
      const videoIdElement = entry.querySelector('videoId');
      let videoId = videoIdElement?.textContent || '';

      if (!videoId) {
        // Fallback: extract from link href
        const linkElement = entry.querySelector('link[rel="alternate"]');
        const href = linkElement?.getAttribute('href') || '';
        const match = href.match(/watch\?v=([^&]+)/);
        videoId = match ? match[1] : '';
      }

      if (!videoId) {
        return; // Skip this entry if we can't find video ID
      }

      // Extract title
      const titleElement = entry.querySelector('title');
      const title = titleElement?.textContent || 'Untitled Video';

      // Extract description from media:group > media:description
      const descriptionElement = entry.querySelector('group description');
      const description = descriptionElement?.textContent || '';

      // Extract published date
      const publishedElement = entry.querySelector('published');
      const publishedAt = publishedElement?.textContent || new Date().toISOString();

      // Extract thumbnail from media:thumbnail
      const thumbnailElement = entry.querySelector('group thumbnail');
      const thumbnailUrl =
        thumbnailElement?.getAttribute('url') ||
        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

      // Extract channel title from author > name
      const authorElement = entry.querySelector('author name');
      const channelTitle = authorElement?.textContent || 'Mark Hazleton';

      const video: YouTubeVideo = {
        id: videoId,
        title,
        description,
        publishedAt,
        thumbnailUrl,
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        channelTitle,
      };

      videos.push(video);
    } catch (error) {
      console.warn('Error parsing video entry:', error);
      // Continue processing other entries
    }
  });

  return videos;
}
