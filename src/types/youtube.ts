export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  videoUrl: string;
  channelTitle: string;
  duration?: number; // Duration in seconds
  viewCount?: number; // View count
}

export interface YouTubeChannel {
  id: string;
  title: string;
  url: string;
}
