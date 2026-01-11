import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { GitBranch } from 'lucide-react';
import { useRepositoryStats } from '@/hooks/use-repository-stats';
import type { Repository } from '@/types/repositories';
import { Seo } from '@/components/Seo';
import { formatDateShort } from '@/lib/date';

export default function GitHub() {
  const repositoryState = useRepositoryStats();

  const recentRepositories = useMemo(
    () => repositoryState.data.slice(0, 10),
    [repositoryState.data],
  );

  const formatNumber = (value: number) => value.toLocaleString('en-US');

  const getRepositoryDetailPath = (repo: Repository) =>
    `/github/repositories/${encodeURIComponent(repo.name)}`;

  const getMostRecentDate = (
    repositories: Repository[],
    metadata: Record<string, unknown> | null,
  ) => {
    const dateStrings: string[] = [];

    const metadataDate = metadata?.generated_at;
    if (typeof metadataDate === 'string') {
      dateStrings.push(metadataDate);
    }

    repositories.forEach((repo) => {
      const repoDates = [
        repo.last_commit_date,
        repo.updated_at,
        repo.pushed_at,
        repo.created_at,
        repo.summary?.generated_at,
      ];

      repoDates.forEach((value) => {
        if (typeof value === 'string') {
          dateStrings.push(value);
        }
      });
    });

    const mostRecent = dateStrings
      .map((value) => new Date(value))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => b.getTime() - a.getTime())[0];

    return mostRecent ?? null;
  };

  const lastUpdated = useMemo(
    () => getMostRecentDate(repositoryState.data, repositoryState.metadata),
    [repositoryState.data, repositoryState.metadata],
  );

  const getSummaryText = (repo: Repository) => {
    const rawSummary = repo.summary?.text ?? repo.ai_summary ?? '';
    if (!rawSummary) {
      return '';
    }

    return rawSummary.replace(/\s+/g, ' ').trim();
  };

  const getSummarySnippet = (repo: Repository, maxLength = 180) => {
    const summary = getSummaryText(repo);
    if (!summary) {
      return null;
    }

    if (summary.length <= maxLength) {
      return summary;
    }

    return `${summary.slice(0, Math.max(0, maxLength - 3))}...`;
  };

  const buildSummaryMetrics = (repo: Repository) => {
    const metrics: string[] = [];

    if (typeof repo.composite_score === 'number') {
      metrics.push(`Spark score ${repo.composite_score.toFixed(1)}`);
    }
    if (typeof repo.rank === 'number') {
      metrics.push(`Rank #${repo.rank}`);
    }
    if (typeof repo.commit_velocity === 'number') {
      metrics.push(`Velocity ${repo.commit_velocity.toFixed(1)}/mo`);
    }

    if (typeof repo.recent_commits_90d === 'number') {
      metrics.push(`${formatNumber(repo.recent_commits_90d)} commits (90d)`);
    } else if (typeof repo.total_commits === 'number') {
      metrics.push(`${formatNumber(repo.total_commits)} total commits`);
    }

    const lastUpdate = repo.last_commit_date ?? repo.updated_at;
    if (lastUpdate) {
      metrics.push(`Updated ${formatDateShort(lastUpdate)}`);
    }

    if (typeof repo.days_since_last_push === 'number') {
      metrics.push(`${repo.days_since_last_push} days since push`);
    }

    if (typeof repo.age_days === 'number') {
      metrics.push(`Age ${repo.age_days} days`);
    }

    if (typeof repo.size_kb === 'number') {
      metrics.push(`${formatNumber(repo.size_kb)} KB`);
    }

    if (typeof repo.stars === 'number') {
      metrics.push(`${formatNumber(repo.stars)} stars`);
    }

    if (typeof repo.forks === 'number') {
      metrics.push(`${formatNumber(repo.forks)} forks`);
    }

    if (typeof repo.watchers === 'number') {
      metrics.push(`${formatNumber(repo.watchers)} watchers`);
    }

    if (typeof repo.language_count === 'number') {
      metrics.push(`${repo.language_count} languages`);
    }

    if (typeof repo.tech_stack?.total_dependencies === 'number') {
      metrics.push(`${repo.tech_stack.total_dependencies} deps`);
    }

    if (typeof repo.tech_stack?.outdated_count === 'number') {
      metrics.push(`${repo.tech_stack.outdated_count} outdated`);
    }

    return metrics;
  };

  return (
    <Layout>
      <Seo
        title="GitHub Activity | Mark Hazleton"
        description="Recent GitHub activity for Mark Hazleton, including the latest repository updates."
        keywords="Mark Hazleton GitHub, repository activity, GitHub updates, open source work"
        canonical="/github"
      />
      <section className="section">
        <div className="container-blog">
          <div className="animate-fade-up">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
              GitHub Activity
            </h1>
            <p className="text-muted-foreground mb-2">
              Last updated: {lastUpdated ? formatDateShort(lastUpdated) : '--'}
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Live activity from{' '}
              <a 
                href="https://github.com/markhazleton"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline underline-offset-2"
              >
                github.com/markhazleton
              </a>{' '}
              showcasing the latest repository updates.
            </p>
          </div>

          <div className="space-y-12">
            {/* Recently Updated Repositories */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <GitBranch className="h-5 w-5 text-foreground" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Recent Repository Activity
                </h2>
              </div>
              <div className="prose-blog mb-6">
                <p>
                  Live snapshot from{' '}
                  <a
                    href="https://github.com/markhazleton/github-stats-spark"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github-stats-spark
                  </a>{' '}
                  with activity summaries pulled from the latest repository data.
                </p>
              </div>
              {repositoryState.status === 'loading' && (
                <p className="text-muted-foreground animate-pulse">
                  Loading recent repository activity...
                </p>
              )}
              {repositoryState.status === 'error' && (
                <p className="text-muted-foreground">{repositoryState.error}</p>
              )}
              {repositoryState.status === 'success' &&
                recentRepositories.length === 0 && (
                  <p className="text-muted-foreground">
                    No repository updates available yet.
                  </p>
                )}
              {repositoryState.status === 'success' &&
                recentRepositories.length > 0 && (
                  <div className="grid gap-4 md:grid-cols-2 stagger-children">
                    {recentRepositories.map((repo) => {
                      const summarySnippet = getSummarySnippet(repo);
                      const metrics = buildSummaryMetrics(repo);
                      const patterns = repo.commit_history?.patterns ?? [];

                      return (
                        <div
                          key={repo.name}
                          className="group paper-card p-5 transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-heading text-xl font-semibold text-foreground mb-1">
                                {repo.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {repo.description ?? 'No description yet.'}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {repo.language && (
                                <span className="tag-pill">{repo.language}</span>
                              )}
                              {repo.is_private && (
                                <span className="tag-pill">Private</span>
                              )}
                              {repo.is_fork && (
                                <span className="tag-pill">Fork</span>
                              )}
                            </div>
                          </div>
                          {summarySnippet && (
                            <p className="mt-3 text-sm text-muted-foreground">
                              {summarySnippet}
                            </p>
                          )}
                          {patterns.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {patterns.map((pattern, index) => (
                                <span key={`${pattern}-${index}`} className="tag-pill">
                                  {pattern.replace(/_/g, ' ')}
                                </span>
                              ))}
                            </div>
                          )}
                          {metrics.length > 0 && (
                            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                              {metrics.map((metric, index) => (
                                <span key={`${repo.name}-metric-${index}`}>
                                  {metric}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="mt-4">
                            <Link
                              to={getRepositoryDetailPath(repo)}
                              className="text-sm text-primary hover:underline underline-offset-2"
                            >
                              View repository metrics
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
