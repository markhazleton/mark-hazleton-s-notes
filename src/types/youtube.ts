export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  videoUrl: string;
  channelTitle: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  url: string;
}
