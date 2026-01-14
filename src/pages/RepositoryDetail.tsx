import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, GitBranch } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Callout } from '@/components/Callout';
import { useRepositoryStats } from '@/hooks/use-repository-stats';
import type { Repository } from '@/types/repositories';
import { Seo } from '@/components/Seo';
import { formatDateShort } from '@/lib/date';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Object.prototype.toString.call(value) === '[object Object]';

const formatNumber = (value: number) => value.toLocaleString('en-US');

const renderMetricValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">N/A</span>;
  }

  if (typeof value === 'string') {
    return (
      <span className={value.includes('\n') ? 'whitespace-pre-wrap' : undefined}>
        {value}
      </span>
    );
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return <span>{String(value)}</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-muted-foreground">None</span>;
    }

    const allPrimitive = value.every((item) =>
      ['string', 'number', 'boolean'].includes(typeof item),
    );

    if (allPrimitive) {
      return <span>{value.join(', ')}</span>;
    }
  }

  if (isPlainObject(value) || Array.isArray(value)) {
    return (
      <pre className="mt-2 whitespace-pre-wrap break-words rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  return <span>{String(value)}</span>;
};

const getSummaryText = (repo: Repository) => {
  const rawSummary = repo.summary?.text ?? repo.ai_summary ?? '';
  if (!rawSummary) {
    return '';
  }

  return rawSummary.trim();
};

export default function RepositoryDetail() {
  const { name } = useParams<{ name: string }>();
  const repositoryState = useRepositoryStats();
  const repositoryName = useMemo(
    () => (name ? decodeURIComponent(name) : ''),
    [name],
  );
  const repository = useMemo(
    () => repositoryState.data.find((repo) => repo.name === repositoryName),
    [repositoryState.data, repositoryName],
  );

  const summaryText = repository ? getSummaryText(repository) : '';

  return (
    <Layout>
      <section className="section">
        <div className="container-blog">
          <Link
            to="/github"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to GitHub activity
          </Link>

          {repositoryState.status === 'loading' && (
            <p className="text-muted-foreground animate-pulse">
              Loading repository metrics...
            </p>
          )}

          {repositoryState.status === 'error' && (
            <Callout type="warning" title="Repository data unavailable">
              {repositoryState.error}
            </Callout>
          )}

          {repositoryState.status === 'success' && !repository && (
            <Callout type="warning" title="Repository not found">
              The repository name does not match the current metrics feed.
            </Callout>
          )}

          {repositoryState.status === 'success' && repository && (
            <>
              <Seo
                title={`Repository Metrics: ${repository.name} | Mark Hazleton`}
                description={
                  repository.description ??
                  `Detailed repository metrics and activity for ${repository.name}.`
                }
                keywords={`repository metrics, ${repository.name}, GitHub analytics, commit history, Mark Hazleton`}
                canonical={`/github/repositories/${encodeURIComponent(repository.name)}`}
                type="article"
              />
              <header className="mb-10 animate-fade-up">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <GitBranch className="h-5 w-5 text-primary" />
                      </div>
                      <span className="tag-pill">Repository</span>
                    </div>
                    <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
                      {repository.name}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      {repository.description ?? 'No description provided.'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {repository.language && (
                      <span className="tag-pill">{repository.language}</span>
                    )}
                    {repository.is_private && (
                      <span className="tag-pill">Private</span>
                    )}
                    {repository.is_fork && <span className="tag-pill">Fork</span>}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="outline" asChild>
                    <a
                      href={repository.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on GitHub
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </header>

              <div className="space-y-8">
                {summaryText && (
                  <div className="paper-card p-6">
                    <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                      Summary
                    </h2>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {summaryText}
                    </p>
                  </div>
                )}

                <div className="paper-card p-6">
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    Snapshot
                  </h2>
                  <dl className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Stars</dt>
                      <dd>
                        {typeof repository.stars === 'number'
                          ? formatNumber(repository.stars)
                          : 'N/A'}
                      </dd>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Forks</dt>
                      <dd>
                        {typeof repository.forks === 'number'
                          ? formatNumber(repository.forks)
                          : 'N/A'}
                      </dd>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Watchers</dt>
                      <dd>
                        {typeof repository.watchers === 'number'
                          ? formatNumber(repository.watchers)
                          : 'N/A'}
                      </dd>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Spark score</dt>
                      <dd>
                        {typeof repository.composite_score === 'number'
                          ? repository.composite_score.toFixed(1)
                          : 'N/A'}
                      </dd>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Rank</dt>
                      <dd>
                        {typeof repository.rank === 'number'
                          ? `#${repository.rank}`
                          : 'N/A'}
                      </dd>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Commit velocity</dt>
                      <dd>
                        {typeof repository.commit_velocity === 'number'
                          ? `${repository.commit_velocity.toFixed(1)}/mo`
                          : 'N/A'}
                      </dd>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Recent commits</dt>
                      <dd>
                        {typeof repository.recent_commits_90d === 'number'
                          ? `${formatNumber(repository.recent_commits_90d)} (90d)`
                          : 'N/A'}
                      </dd>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Total commits</dt>
                      <dd>
                        {typeof repository.total_commits === 'number'
                          ? formatNumber(repository.total_commits)
                          : 'N/A'}
                      </dd>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Last commit</dt>
                      <dd>{formatDateShort(repository.last_commit_date)}</dd>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Last push</dt>
                      <dd>{formatDateShort(repository.pushed_at)}</dd>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Created</dt>
                      <dd>{formatDateShort(repository.created_at)}</dd>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Updated</dt>
                      <dd>{formatDateShort(repository.updated_at)}</dd>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Age</dt>
                      <dd>
                        {typeof repository.age_days === 'number'
                          ? `${repository.age_days} days`
                          : 'N/A'}
                      </dd>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Days since push</dt>
                      <dd>
                        {typeof repository.days_since_last_push === 'number'
                          ? `${repository.days_since_last_push} days`
                          : 'N/A'}
                      </dd>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Repo size</dt>
                      <dd>
                        {typeof repository.size_kb === 'number'
                          ? `${formatNumber(repository.size_kb)} KB`
                          : 'N/A'}
                      </dd>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Languages</dt>
                      <dd>
                        {typeof repository.language_count === 'number'
                          ? repository.language_count
                          : 'N/A'}
                      </dd>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Dependencies</dt>
                      <dd>
                        {typeof repository.tech_stack?.total_dependencies === 'number'
                          ? repository.tech_stack.total_dependencies
                          : 'N/A'}
                      </dd>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Outdated deps</dt>
                      <dd>
                        {typeof repository.tech_stack?.outdated_count === 'number'
                          ? repository.tech_stack.outdated_count
                          : 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="paper-card p-6">
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    All metrics
                  </h2>
                  <dl className="space-y-4 text-sm">
                    {Object.entries(repository)
                      .filter(([key]) => key !== 'summary' && key !== 'ai_summary')
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([key, value]) => (
                        <div key={key} className="flex flex-col gap-2">
                          <dt className="font-medium text-foreground">{key}</dt>
                          <dd className="text-muted-foreground">
                            {renderMetricValue(value)}
                          </dd>
                        </div>
                      ))}
                  </dl>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
