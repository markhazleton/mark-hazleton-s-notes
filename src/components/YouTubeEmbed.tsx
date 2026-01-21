import { useState } from 'react';
import { Play } from 'lucide-react';

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  autoplay?: boolean;
  className?: string;
}

/**
 * YouTube Embed Component
 * 
 * Displays a YouTube video with:
 * - Lazy loading (thumbnail preview with click-to-play)
 * - Responsive 16:9 aspect ratio
 * - SEO-friendly schema markup
 * - Optimized loading (only loads iframe when clicked)
 */
export function YouTubeEmbed({ videoId, title, autoplay = false, className = '' }: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);

  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  if (isPlaying) {
    return (
      <div className={`relative w-full aspect-video overflow-hidden rounded-lg shadow-lg ${className}`}>
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsPlaying(true)}
      className={`group relative w-full aspect-video overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow ${className}`}
      aria-label={`Play video: ${title}`}
    >
      {/* Thumbnail */}
      <img
        src={thumbnailUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
      
      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-red-600 group-hover:bg-red-700 group-hover:scale-110 transition-all flex items-center justify-center shadow-lg">
          <Play className="h-10 w-10 text-white ml-1" fill="currentColor" />
        </div>
      </div>
      
      {/* Watch on YouTube Link */}
      <div className="absolute bottom-4 right-4">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/90 hover:text-white bg-black/50 hover:bg-black/70 px-3 py-1.5 rounded transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          Watch on YouTube
        </a>
      </div>
    </button>
  );
}
