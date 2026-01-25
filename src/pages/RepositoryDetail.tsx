import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  Star,
  GitFork,
  Eye,
  Zap,
  Trophy,
  Activity,
  GitCommit,
  Calendar,
  Clock,
  HardDrive,
  Code2,
  Package,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Flame,
  Sparkles,
  Bot,
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Callout } from '@/components/Callout';
import { useRepositoryStats } from '@/hooks/use-repository-stats';
import type { Repository, RepositoryTechStackDependency } from '@/types/repositories';
import { Seo } from '@/components/Seo';
import { formatDateShort } from '@/lib/date';

const formatNumber = (value: number) => value.toLocaleString('en-US');

const getSummaryText = (repo: Repository) => {
  const rawSummary = repo.summary?.text ?? repo.ai_summary ?? '';
  if (!rawSummary) {
    return '';
  }
  return rawSummary.trim();
};

// Language colors for visualization
const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572A5',
  'C#': '#178600',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  SCSS: '#c6538c',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Markdown: '#083fa1',
  JSON: '#292929',
  YAML: '#cb171e',
  Pug: '#a86454',
};

const getLanguageColor = (lang: string) => languageColors[lang] || '#6b7280';

// Pattern badge styling
const patternStyles: Record<string, { bg: string; text: string; icon: typeof TrendingUp }> = {
  highly_active: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: Flame },
  recently_updated: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: Clock },
  accelerating: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', icon: TrendingUp },
  consistent: { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-400', icon: Activity },
  sporadic: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: Zap },
  dormant: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', icon: Clock },
};

const formatPatternLabel = (pattern: string) => {
  return pattern.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

type StatCardProps = {
  icon: typeof Star;
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
};

const StatCard = ({ icon: Icon, label, value, subtext, color = 'text-primary' }: StatCardProps) => (
  <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
    <div className={`p-2.5 rounded-lg bg-primary/10 ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold text-foreground mt-0.5">{value}</p>
      {subtext && <p className="text-xs text-muted-foreground mt-0.5">{subtext}</p>}
    </div>
  </div>
);

type LanguageBarProps = {
  languages: Record<string, number>;
};

const LanguageBar = ({ languages }: LanguageBarProps) => {
  const entries = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, val]) => sum + val, 0);
  if (total === 0) return null;

  return (
    <div className="space-y-3">
      <div className="h-3 rounded-full overflow-hidden flex bg-muted/30">
        {entries.map(([lang, bytes]) => {
          const pct = (bytes / total) * 100;
          if (pct < 0.5) return null;
          return (
            <div
              key={lang}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{ width: `${pct}%`, backgroundColor: getLanguageColor(lang) }}
              title={`${lang}: ${pct.toFixed(1)}%`}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3">
        {entries.slice(0, 8).map(([lang, bytes]) => {
          const pct = (bytes / total) * 100;
          return (
            <div key={lang} className="flex items-center gap-1.5 text-sm">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getLanguageColor(lang) }}
              />
              <span className="text-foreground font-medium">{lang}</span>
              <span className="text-muted-foreground">{pct.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

type DependencyCardProps = {
  dep: RepositoryTechStackDependency;
};

const DependencyCard = ({ dep }: DependencyCardProps) => {
  const isOutdated = dep.is_outdated;
  const statusIcon = isOutdated ? AlertTriangle : CheckCircle2;
  const StatusIcon = statusIcon;

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${
      isOutdated
        ? 'border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20'
        : 'border-border/50 bg-card'
    }`}>
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-foreground">{dep.name}</span>
        {dep.current_version && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
            v{dep.current_version}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {dep.ecosystem && (
          <span className="text-xs text-muted-foreground">{dep.ecosystem}</span>
        )}
        <StatusIcon className={`h-4 w-4 ${isOutdated ? 'text-yellow-600 dark:text-yellow-500' : 'text-green-600 dark:text-green-500'}`} />
      </div>
    </div>
  );
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

  // Get language data from either languages or language_stats
  const languageData = useMemo(() => {
    if (!repository) return {};
    return repository.languages && Object.keys(repository.languages).length > 0
      ? repository.languages
      : repository.language_stats && Object.keys(repository.language_stats).length > 0
      ? repository.language_stats
      : repository.tech_stack?.languages ?? {};
  }, [repository]);

  const hasLanguageData = Object.keys(languageData).length > 0;
  const commitPatterns = repository?.commit_history?.patterns ?? [];
  const dependencies = repository?.tech_stack?.dependencies ?? [];

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
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20" />
                <p className="text-muted-foreground">Loading repository metrics...</p>
              </div>
            </div>
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

              {/* Header */}
              <header className="mb-10 animate-fade-up">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                        <GitBranch className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="tag-pill">Repository</span>
                        {typeof repository.rank === 'number' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                            <Trophy className="h-3 w-3" />
                            Rank #{repository.rank}
                          </span>
                        )}
                      </div>
                    </div>
                    <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">
                      {repository.name}
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                      {repository.description ?? 'No description provided.'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {repository.language && (
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-card border border-border"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: getLanguageColor(repository.language) }}
                        />
                        {repository.language}
                      </span>
                    )}
                    {repository.is_private && (
                      <span className="tag-pill">Private</span>
                    )}
                    {repository.is_fork && <span className="tag-pill">Fork</span>}
                  </div>
                </div>

                {/* Activity Patterns */}
                {commitPatterns.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {commitPatterns.map((pattern) => {
                      const style = patternStyles[pattern] || patternStyles.consistent;
                      const Icon = style.icon;
                      return (
                        <span
                          key={pattern}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {formatPatternLabel(pattern)}
                        </span>
                      );
                    })}
                  </div>
                )}

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
                {/* AI Summary */}
                {summaryText && (
                  <div className="paper-card p-6 animate-fade-up">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-500/10">
                        <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <h2 className="font-heading text-xl font-semibold text-foreground">
                          AI Summary
                        </h2>
                        {repository.summary?.ai_generated && (
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Bot className="h-3 w-3" />
                            <span>
                              Generated by {repository.summary.model_used ?? 'AI'}
                              {repository.summary.confidence_score && (
                                <> with {repository.summary.confidence_score}% confidence</>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {summaryText}
                    </p>
                  </div>
                )}

                {/* Key Metrics Grid */}
                <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Key Metrics
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                      icon={Star}
                      label="Stars"
                      value={typeof repository.stars === 'number' ? formatNumber(repository.stars) : 'N/A'}
                      color="text-amber-500"
                    />
                    <StatCard
                      icon={GitFork}
                      label="Forks"
                      value={typeof repository.forks === 'number' ? formatNumber(repository.forks) : 'N/A'}
                      color="text-blue-500"
                    />
                    <StatCard
                      icon={Eye}
                      label="Watchers"
                      value={typeof repository.watchers === 'number' ? formatNumber(repository.watchers) : 'N/A'}
                      color="text-purple-500"
                    />
                    <StatCard
                      icon={Zap}
                      label="Spark Score"
                      value={typeof repository.composite_score === 'number' ? repository.composite_score.toFixed(1) : 'N/A'}
                      subtext="Composite activity score"
                      color="text-orange-500"
                    />
                    <StatCard
                      icon={TrendingUp}
                      label="Commit Velocity"
                      value={typeof repository.commit_velocity === 'number' ? `${repository.commit_velocity.toFixed(1)}/mo` : 'N/A'}
                      subtext="Commits per month"
                      color="text-green-500"
                    />
                    <StatCard
                      icon={GitCommit}
                      label="Total Commits"
                      value={typeof repository.total_commits === 'number' ? formatNumber(repository.total_commits) : 'N/A'}
                      subtext={typeof repository.recent_commits_90d === 'number' ? `${repository.recent_commits_90d} in last 90 days` : undefined}
                      color="text-teal-500"
                    />
                  </div>
                </div>

                {/* Timeline Section */}
                <div className="paper-card p-6 animate-fade-up" style={{ animationDelay: '0.15s' }}>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Timeline
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Created</p>
                      <p className="text-foreground font-medium">{formatDateShort(repository.created_at)}</p>
                      {typeof repository.age_days === 'number' && (
                        <p className="text-xs text-muted-foreground">{repository.age_days} days ago</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Commit</p>
                      <p className="text-foreground font-medium">{formatDateShort(repository.last_commit_date)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Push</p>
                      <p className="text-foreground font-medium">{formatDateShort(repository.pushed_at)}</p>
                      {typeof repository.days_since_last_push === 'number' && (
                        <p className="text-xs text-muted-foreground">{repository.days_since_last_push} days ago</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Updated</p>
                      <p className="text-foreground font-medium">{formatDateShort(repository.updated_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Languages Section */}
                {hasLanguageData && (
                  <div className="paper-card p-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                    <h2 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-primary" />
                      Languages
                      {typeof repository.language_count === 'number' && (
                        <span className="text-sm font-normal text-muted-foreground">
                          ({repository.language_count} detected)
                        </span>
                      )}
                    </h2>
                    <LanguageBar languages={languageData} />
                  </div>
                )}

                {/* Tech Stack & Dependencies */}
                {dependencies.length > 0 && (
                  <div className="paper-card p-6 animate-fade-up" style={{ animationDelay: '0.25s' }}>
                    <h2 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      Dependencies
                      <span className="text-sm font-normal text-muted-foreground">
                        ({dependencies.length} packages)
                      </span>
                      {typeof repository.tech_stack?.outdated_count === 'number' && repository.tech_stack.outdated_count > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                          <AlertTriangle className="h-3 w-3" />
                          {repository.tech_stack.outdated_count} outdated
                        </span>
                      )}
                    </h2>
                    {repository.tech_stack?.frameworks && repository.tech_stack.frameworks.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Frameworks</p>
                        <div className="flex flex-wrap gap-2">
                          {repository.tech_stack.frameworks.map((fw) => (
                            <span key={fw} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                              {fw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid gap-2 sm:grid-cols-2">
                      {dependencies.slice(0, 12).map((dep) => (
                        <DependencyCard key={dep.name} dep={dep} />
                      ))}
                    </div>
                    {dependencies.length > 12 && (
                      <p className="mt-3 text-sm text-muted-foreground text-center">
                        + {dependencies.length - 12} more dependencies
                      </p>
                    )}
                  </div>
                )}

                {/* Repository Info */}
                <div className="paper-card p-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-primary" />
                    Repository Info
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Size</p>
                        <p className="font-medium text-foreground">
                          {typeof repository.size_kb === 'number' ? `${formatNumber(repository.size_kb)} KB` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Has README</p>
                        <p className="font-medium text-foreground">
                          {repository.has_readme ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                    {repository.tech_stack?.dependency_file_type && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted/50">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Package Manager</p>
                          <p className="font-medium text-foreground">
                            {repository.tech_stack.dependency_file_type}
                          </p>
                        </div>
                      </div>
                    )}
                    {typeof repository.tech_stack?.currency_score === 'number' && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted/50">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Currency Score</p>
                          <p className="font-medium text-foreground">
                            {repository.tech_stack.currency_score.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    )}
                    {typeof repository.commit_history?.consistency_score === 'number' && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted/50">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Consistency Score</p>
                          <p className="font-medium text-foreground">
                            {repository.commit_history.consistency_score.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    )}
                    {typeof repository.commit_history?.activity_rate === 'number' && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted/50">
                          <Flame className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Activity Rate</p>
                          <p className="font-medium text-foreground">
                            {repository.commit_history.activity_rate.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
