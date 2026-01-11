import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Callout } from '@/components/Callout';
import { BookOpen, Code, Users, MapPin, GitBranch, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRepositoryStats } from '@/hooks/use-repository-stats';
import type { Repository } from '@/types/repositories';
import { posts } from '@/data/posts';
import { Seo } from '@/components/Seo';

export default function Now() {
  const repositoryState = useRepositoryStats();

  const recentRepositories = useMemo(
    () => repositoryState.data.slice(0, 6),
    [repositoryState.data],
  );

  const recentArticles = useMemo(() => posts.slice(0, 4), []);

  const stripMarkdown = (value: string) =>
    value
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]*`/g, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^\s*>+\s?/gm, '')
      .replace(/^\s*[-*+]\s+/gm, '')
      .replace(/[*_~]/g, '')
      .replace(/\r?\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const buildExcerptPreview = (value: string, maxLength = 100) => {
    const plainText = stripMarkdown(value);
    if (plainText.length <= maxLength) {
      return { text: plainText, truncated: false };
    }

    const truncated = plainText.slice(0, maxLength);
    const clipped = truncated.replace(/\s+\S*$/, '').trim();

    return { text: clipped || truncated, truncated: true };
  };

  const formatDate = (value?: string) => {
    if (!value) {
      return 'Unknown';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return 'Unknown';
    }

    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatNumber = (value: number) => value.toLocaleString('en-US');

  const getRepositoryDetailPath = (repo: Repository) =>
    `/now/repositories/${encodeURIComponent(repo.name)}`;

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
      metrics.push(`Updated ${formatDate(lastUpdate)}`);
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
        title="Now | Mark Hazleton"
        description="A snapshot of what Mark Hazleton is working on right now, including recent repositories and articles."
        keywords="Mark Hazleton now, current projects, repository updates, recent articles, technical focus"
        canonical="/now"
      />
      <section className="section">
        <div className="container-blog">
          <div className="animate-fade-up">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
              What I'm Doing Now
            </h1>
            <p className="text-muted-foreground mb-2">
              Last updated: {lastUpdated ? formatDate(lastUpdated.toISOString()) : '--'}
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              A snapshot of what I'm focused on right now. Inspired by{' '}
              <a 
                href="https://nownownow.com/about" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline underline-offset-2"
              >
                the /now page movement
              </a>.
            </p>
          </div>

          <div className="space-y-12">
            {/* Currently Working On */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Currently Working On
                </h2>
              </div>
              <div className="prose-blog">
                <ul>
                  <li>
                    <strong>Event-driven reference architecture</strong> — Building a comprehensive 
                    reference implementation for event-driven microservices on Azure. The goal is 
                    to demonstrate patterns like event sourcing, CQRS, and saga orchestration in a 
                    realistic, production-ready context.
                  </li>
                  <li>
                    <strong>Observability deep-dive</strong> — Exploring OpenTelemetry instrumentation 
                    patterns and building a workshop around practical observability for distributed 
                    systems. Focusing on the "so what" of metrics and traces.
                  </li>
                  <li>
                    <strong>Architecture decision records</strong> — Writing more publicly about 
                    architectural decisions and tradeoffs. Trying to make the implicit explicit.
                  </li>
                </ul>
              </div>
            </div>

            {/* Recently Updated Repositories */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <GitBranch className="h-5 w-5 text-foreground" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Recently Updated Repositories
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

            {/* Recent Articles */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Recent Articles
                </h2>
              </div>
              <div className="prose-blog mb-6">
                <p>Fresh writing pulled from the latest articles feed.</p>
              </div>
              {recentArticles.length === 0 && (
                <p className="text-muted-foreground">No articles available yet.</p>
              )}
              {recentArticles.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 stagger-children">
                  {recentArticles.map((article) => {
                    const excerptPreview = buildExcerptPreview(article.excerpt);

                    return (
                      <Link
                        key={article.slug}
                        to={`/blog/${article.slug}`}
                        className="group paper-card p-5 transition-all duration-300 hover:-translate-y-1"
                      >
                        {article.image && (
                          <div className="mb-4 overflow-hidden rounded-lg border border-border bg-card">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-heading text-xl font-semibold text-foreground mb-1">
                              {article.title}
                            </h3>
                            <div className="text-sm text-muted-foreground">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  p({ children }) {
                                    return <span>{children}</span>;
                                  },
                                }}
                              >
                                {excerptPreview.text}
                              </ReactMarkdown>
                              {excerptPreview.truncated && (
                                <span className="text-primary hover:underline underline-offset-2">
                                  {' '}
                                  ... more
                                </span>
                              )}
                            </div>
                          </div>
                          {article.tags.length > 0 && (
                            <span className="tag-pill">{article.tags[0]}</span>
                          )}
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span>{formatDate(article.date)}</span>
                          <span>{article.readingTime}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Learning */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-accent" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Learning
                </h2>
              </div>
              <div className="prose-blog">
                <ul>
                  <li>
                    <strong>Platform engineering</strong> — How to build internal developer 
                    platforms that actually get adopted. The organizational patterns matter as 
                    much as the technical ones.
                  </li>
                  <li>
                    <strong>AI/ML integration patterns</strong> — Understanding how to 
                    responsibly integrate AI capabilities into enterprise applications. 
                    Currently focused on RAG patterns and vector databases.
                  </li>
                  <li>
                    <strong>Rust</strong> — Taking my time with this one. The ownership model 
                    is fascinating and I'm curious about its applications in cloud-native tooling.
                  </li>
                </ul>
              </div>
            </div>

            {/* Reading */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Reading
                </h2>
              </div>
              <div className="prose-blog">
                <ul>
                  <li>
                    <em>Team Topologies</em> by Matthew Skelton & Manuel Pais — Rereading 
                    this with fresh eyes after some platform team experiences.
                  </li>
                  <li>
                    <em>Designing Data-Intensive Applications</em> by Martin Kleppmann — 
                    The gift that keeps on giving. Always finding new insights.
                  </li>
                  <li>
                    <em>The Staff Engineer's Path</em> by Tanya Reilly — Excellent framework 
                    for thinking about technical leadership.
                  </li>
                </ul>
              </div>
            </div>

            {/* Speaking */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Speaking & Community
                </h2>
              </div>
              <div className="prose-blog">
                <ul>
                  <li>
                    Preparing an updated version of my resilience patterns talk for 
                    spring conferences.
                  </li>
                  <li>
                    Running a monthly architecture office hours for a local tech community.
                  </li>
                  <li>
                    Open to podcast appearances and guest posts — reach out if interested.
                  </li>
                </ul>
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Location
                </h2>
              </div>
              <p className="text-muted-foreground">
                Based in Wichita, KS, working remotely. Occasionally traveling for
                conferences and client work.
              </p>
            </div>

            <Callout type="info" title="Want to connect?">
              If any of these topics resonate with you, I'd love to chat. The best way 
              to reach me is through the{' '}
              <Link to="/contact" className="text-primary hover:underline">
                contact page
              </Link>
              .
            </Callout>
          </div>
        </div>
      </section>
    </Layout>
  );
}
