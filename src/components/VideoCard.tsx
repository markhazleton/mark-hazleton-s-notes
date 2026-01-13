import { Calendar, ExternalLink } from 'lucide-react';
import type { YouTubeVideo } from '@/types/youtube';
import { formatDateShort } from '@/lib/date';

interface VideoCardProps {
  video: YouTubeVideo;
}

export function VideoCard({ video }: VideoCardProps) {
  // Truncate description to ~150 characters
  const truncatedDescription =
    video.description.length > 150
      ? `${video.description.slice(0, 150)}...`
      : video.description;

  return (
    <a
      href={video.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block paper-card p-0 overflow-hidden transition-all duration-300 hover:-translate-y-1"
    >
      {/* Thumbnail with 16:9 aspect ratio */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* External link indicator */}
        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ExternalLink className="h-4 w-4 text-foreground" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
          {video.title}
        </h3>

        {truncatedDescription && (
          <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">
            {truncatedDescription}
          </p>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDateShort(video.publishedAt)}</span>
        </div>
      </div>
    </a>
  );
}
