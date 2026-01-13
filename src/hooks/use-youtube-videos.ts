import { useMemo } from 'react';
import { sortedYoutubeVideos, youtubeMetadata } from '@/lib/data/youtube-videos';
import type { YouTubeVideo } from '@/types/youtube';

type YouTubeStatus = 'idle' | 'loading' | 'success' | 'error';

type YouTubeState = {
  status: YouTubeStatus;
  data: YouTubeVideo[];
  error: string | null;
  metadata: {
    generated_at: string;
    channel_id: string;
  } | null;
};

export function useYouTubeVideos(_channelId?: string) {
  const state = useMemo<YouTubeState>(() => {
    // Check if there was an error fetching videos at build time
    if (youtubeMetadata.error) {
      return {
        status: 'error',
        data: [],
        error: 'Unable to load YouTube videos. Videos are fetched at build time.',
        metadata: {
          generated_at: youtubeMetadata.generated_at,
          channel_id: youtubeMetadata.channel_id,
        },
      };
    }

    // Return the pre-fetched videos
    return {
      status: 'success',
      data: sortedYoutubeVideos,
      error: null,
      metadata: {
        generated_at: youtubeMetadata.generated_at,
        channel_id: youtubeMetadata.channel_id,
      },
    };
  }, []);

  return state;
}
