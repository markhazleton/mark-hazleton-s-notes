import type { YouTubeVideo } from '@/types/youtube';
import videosData from '@/data/youtube-videos.json';

export interface YouTubeVideosPayload {
  generated_at: string;
  channel_id: string;
  videos: YouTubeVideo[];
  error?: string;
}

// Load videos from the static JSON file
const payload = videosData as YouTubeVideosPayload;

export const youtubeVideos: YouTubeVideo[] = payload.videos || [];
export const youtubeMetadata = {
  generated_at: payload.generated_at,
  channel_id: payload.channel_id,
  error: payload.error,
};

// Export sorted by date (newest first)
export const sortedYoutubeVideos = [...youtubeVideos].sort((a, b) => {
  const dateA = new Date(a.publishedAt).getTime();
  const dateB = new Date(b.publishedAt).getTime();
  return dateB - dateA;
});

// Video categories based on title patterns
export const getVideoCategory = (video: YouTubeVideo): string => {
  const title = video.title.toLowerCase();

  if (title.startsWith('deep dive:')) return 'Deep Dive';
  if (title.includes('promptspark')) return 'PromptSpark';
  if (title.includes('mechanics of motherhood')) return 'Mechanics of Motherhood';
  if (title.includes('sora')) return 'AI Tools';
  if (title.includes('tutorial') || title.includes('demo')) return 'Tutorials';

  return 'General';
};

// Get all unique categories
export const allCategories = Array.from(
  new Set(youtubeVideos.map(getVideoCategory))
).sort();

// Get videos by category
export const getVideosByCategory = (category: string) =>
  sortedYoutubeVideos.filter((v) => getVideoCategory(v) === category);

// Video statistics
export const videoStats = {
  totalVideos: youtubeVideos.length,
  totalViews: youtubeVideos.reduce((sum, v) => sum + (v.viewCount || 0), 0),
  totalDurationSeconds: youtubeVideos.reduce((sum, v) => sum + (v.duration || 0), 0),
  totalDurationHours: Math.round(
    (youtubeVideos.reduce((sum, v) => sum + (v.duration || 0), 0) / 3600) * 10
  ) / 10,
  averageViews: Math.round(
    youtubeVideos.reduce((sum, v) => sum + (v.viewCount || 0), 0) / youtubeVideos.length
  ),
  averageDurationMinutes: Math.round(
    (youtubeVideos.reduce((sum, v) => sum + (v.duration || 0), 0) / youtubeVideos.length / 60) * 10
  ) / 10,
  oldestVideo: sortedYoutubeVideos[sortedYoutubeVideos.length - 1],
  newestVideo: sortedYoutubeVideos[0],
  mostViewedVideo: [...youtubeVideos].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))[0],
  categoryCounts: allCategories.reduce(
    (acc, cat) => {
      acc[cat] = getVideosByCategory(cat).length;
      return acc;
    },
    {} as Record<string, number>
  ),
};

// Filter videos by search term
export const searchVideos = (query: string): YouTubeVideo[] => {
  if (!query) return sortedYoutubeVideos;

  const searchLower = query.toLowerCase();
  return sortedYoutubeVideos.filter((video) => {
    const searchable = [
      video.title,
      video.description,
      video.channelTitle,
      getVideoCategory(video),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchable.includes(searchLower);
  });
};

// Get featured videos (most recent Deep Dive episodes)
export const featuredVideos = sortedYoutubeVideos
  .filter((v) => getVideoCategory(v) === 'Deep Dive')
  .slice(0, 6);
