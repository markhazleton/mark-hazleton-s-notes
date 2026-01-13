import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Seo } from '@/components/Seo';
import { VideoCard } from '@/components/VideoCard';
import { SearchInput } from '@/components/SearchInput';
import { useYouTubeVideos } from '@/hooks/use-youtube-videos';
import { Button } from '@/components/ui/button';
import {
  Youtube,
  AlertCircle,
  Loader2,
  Eye,
  Clock,
  Video,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { allCategories, getVideoCategory, videoStats } from '@/lib/data/youtube-videos';

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@MarkHazleton';

const parseCategoryFromSearch = (search: string) => {
  if (!search) return null;
  const params = new URLSearchParams(search);
  return params.get('category');
};

export default function Videos() {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { status, data: allVideos, error } = useYouTubeVideos();

  const selectedCategory = parseCategoryFromSearch(location.search);

  const filteredVideos = useMemo(() => {
    let result = allVideos;

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter((video) => {
        const haystack = [
          video.title,
          video.description,
          video.channelTitle,
          getVideoCategory(video),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(searchLower);
      });
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((video) => getVideoCategory(video) === selectedCategory);
    }

    return result;
  }, [allVideos, search, selectedCategory]);

  const toggleCategory = (category: string) => {
    if (selectedCategory === category) {
      navigate({ search: '' }, { replace: true });
    } else {
      const params = new URLSearchParams();
      params.set('category', category);
      navigate({ search: params.toString() }, { replace: true });
    }
  };

  const clearFilters = () => {
    setSearch('');
    navigate({ search: '' }, { replace: true });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <Layout>
      <Seo
        title="Videos & Tutorials | Mark Hazleton"
        description="Technical tutorials on cloud architecture, Azure, .NET development, and system design from Mark Hazleton's YouTube channel."
        keywords="Mark Hazleton videos, cloud architecture tutorials, Azure tutorials, .NET videos, system design tutorials"
        canonical="/videos"
      />
      <section className="section">
        <div className="container-wide">
          {/* Header */}
          <div className="max-w-2xl mb-10 animate-fade-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Youtube className="h-6 w-6 text-primary" />
              </div>
              <h1 className="font-heading text-4xl font-bold text-foreground">
                Videos & Tutorials
              </h1>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              Technical tutorials, architecture deep-dives, and cloud development insights
              from my YouTube channel. Practical demonstrations of <strong>Azure</strong>,
              <strong> .NET</strong>, and <strong>system design</strong> concepts.
            </p>
            <Button asChild variant="outline" size="lg">
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Youtube className="h-5 w-5" />
                Visit YouTube Channel
              </a>
            </Button>
          </div>

          {/* Stats */}
          {status === 'success' && allVideos.length > 0 && (
            <div className="grid gap-4 md:grid-cols-4 mb-8">
              <div className="paper-card p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Video className="h-4 w-4" />
                  <span className="text-sm">Total Videos</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{videoStats.totalVideos}</p>
              </div>
              <div className="paper-card p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">Total Views</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {videoStats.totalViews.toLocaleString()}
                </p>
              </div>
              <div className="paper-card p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Total Content</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {videoStats.totalDurationHours}h
                </p>
              </div>
              <div className="paper-card p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Avg Duration</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {videoStats.averageDurationMinutes}m
                </p>
              </div>
            </div>
          )}

          {/* Filters */}
          {status === 'success' && allVideos.length > 0 && (
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 max-w-md">
                  <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search videos..."
                  />
                </div>
                {(search || selectedCategory) && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Filter by category:</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`tag-pill cursor-pointer transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {category} ({videoStats.categoryCounts[category] || 0})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading videos...</p>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="flex flex-col items-center justify-center py-16 paper-card p-8">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                Unable to Load Videos
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                {error || 'There was an error loading videos from YouTube. Please try again later.'}
              </p>
              <Button asChild variant="default">
                <a
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Youtube className="h-5 w-5" />
                  Watch on YouTube
                </a>
              </Button>
            </div>
          )}

          {/* Success State - Video Grid */}
          {status === 'success' && filteredVideos.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-children">
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}

          {/* No Results */}
          {status === 'success' && allVideos.length > 0 && filteredVideos.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No videos found matching your criteria.</p>
              <Button variant="ghost" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}

          {/* Empty State */}
          {status === 'success' && allVideos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 paper-card p-8">
              <Youtube className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                No Videos Available Yet
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Videos will appear here once they're published to the channel. Subscribe on
                YouTube to be notified when new content is available!
              </p>
              <Button asChild variant="default">
                <a
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Youtube className="h-5 w-5" />
                  Subscribe on YouTube
                </a>
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
