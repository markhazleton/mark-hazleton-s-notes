import { Link } from 'react-router-dom';
import { ArrowRight, Package, Box } from 'lucide-react';
import type { Project } from '@/lib/data/projects';

interface FeaturedProjectCardProps {
  project: Project;
}

function getPackageName(project: Project): string | null {
  if (project.featuredType === 'npm') {
    // Extract package name from repository or use slug
    return project.repository?.name?.split('/').pop() ?? project.slug;
  }
  if (project.featuredType === 'nuget') {
    // NuGet package names - extract from title or use common patterns
    const title = project.title;
    if (title.includes('WebSpark.HttpClientUtility')) return 'WebSpark.HttpClientUtility';
    if (title.includes('WebSpark') && title.includes('Bootswatch')) return 'WebSpark.Bootswatch';
    // Fallback: try to extract from keywords
    const nugetKeyword = project.keywords.find(k => k.toLowerCase().includes('webspark'));
    return nugetKeyword ?? null;
  }
  return null;
}

function PackageBadges({ project }: { project: Project }) {
  const packageName = getPackageName(project);

  if (!packageName) return null;

  if (project.featuredType === 'npm') {
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        <img
          src={`https://img.shields.io/npm/v/${packageName}?style=flat-square&logo=npm&logoColor=white&label=version`}
          alt={`${packageName} npm version`}
          className="h-5"
          loading="lazy"
        />
        <img
          src={`https://img.shields.io/npm/dm/${packageName}?style=flat-square&logo=npm&logoColor=white&label=downloads`}
          alt={`${packageName} npm downloads`}
          className="h-5"
          loading="lazy"
        />
      </div>
    );
  }

  if (project.featuredType === 'nuget') {
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        <img
          src={`https://img.shields.io/nuget/v/${packageName}?style=flat-square&logo=nuget&logoColor=white&label=version`}
          alt={`${packageName} NuGet version`}
          className="h-5"
          loading="lazy"
        />
        <img
          src={`https://img.shields.io/nuget/dt/${packageName}?style=flat-square&logo=nuget&logoColor=white&label=downloads`}
          alt={`${packageName} NuGet downloads`}
          className="h-5"
          loading="lazy"
        />
      </div>
    );
  }

  return null;
}

function FeaturedTypeBadge({ type }: { type: Project['featuredType'] }) {
  if (type === 'npm') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
        <Package className="h-3 w-3" />
        npm
      </span>
    );
  }
  if (type === 'nuget') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
        <Box className="h-3 w-3" />
        NuGet
      </span>
    );
  }
  return null;
}

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const hasImage = Boolean(project.image);

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block paper-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex flex-col h-full">
        {/* Header with image and type badge */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={
              hasImage
                ? "w-12 h-12 rounded-lg overflow-hidden shrink-0 ring-2 ring-primary/20"
                : "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 text-primary"
            }
          >
            {hasImage ? (
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <Package className="h-6 w-6" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <FeaturedTypeBadge type={project.featuredType} />
              <span className="tag-pill text-xs">Featured</span>
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
          {project.description}
        </p>

        {/* Package badges */}
        <PackageBadges project={project} />

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <span className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 gap-1 transition-all">
            View project
            <ArrowRight className="h-4 w-4" />
          </span>
          {project.url && (
            <span className="text-xs text-muted-foreground truncate max-w-[150px]">
              {new URL(project.url).hostname}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
