import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { GitBranch, Sparkles } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { SearchInput } from '@/components/SearchInput';
import { TagFilter } from '@/components/TagFilter';
import { useRepositoryStats } from '@/hooks/use-repository-stats';
import type { Repository } from '@/types/repositories';
import { Seo } from '@/components/Seo';
import { formatDateShort } from '@/lib/date';

type SortOption =
  | 'recent'
  | 'oldest'
  | 'stars'
  | 'forks'
  | 'commits'
  | 'velocity'
  | 'score'
  | 'rank'
  | 'size'
  | 'name';

type VisibilityFilter = 'all' | 'public' | 'private';
type OriginFilter = 'all' | 'sources' | 'forks';
type ActivityFilter =
  | 'all'
  | 'active-30'
  | 'active-90'
  | 'active-180'
  | 'active-365'
  | 'stale';
type ReadmeFilter = 'all' | 'readme';

const formatNumber = (value: number) => value.toLocaleString('en-US');

const normalizeTag = (value: string) => value.trim().toLowerCase();

const getRepositoryUpdatedAt = (repo: Repository) =>
  repo.last_commit_date ?? repo.updated_at ?? repo.pushed_at ?? repo.created_at;

const getRepositoryLanguages = (repo: Repository) => {
  const languages = new Set<string>();

  if (repo.language) {
    languages.add(repo.language);
  }

  Object.keys(repo.languages ?? {}).forEach((language) => languages.add(language));
  Object.keys(repo.language_stats ?? {}).forEach((language) => languages.add(language));

  return Array.from(languages);
};

const getRepositorySignals = (repo: Repository) => {
  const signals = new Set<string>();

  repo.commit_history?.patterns?.forEach((pattern) => {
    signals.add(pattern.replace(/_/g, ' '));
  });

  repo.tech_stack?.frameworks?.forEach((framework) => {
    if (framework) {
      signals.add(framework);
    }
  });

  return Array.from(signals);
};

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

const getDaysSinceLastUpdate = (repo: Repository) => {
  if (typeof repo.days_since_last_push === 'number') {
    return repo.days_since_last_push;
  }

  const updatedAt = getRepositoryUpdatedAt(repo);
  if (!updatedAt) {
    return null;
  }

  const timestamp = new Date(updatedAt).getTime();
  if (Number.isNaN(timestamp)) {
    return null;
  }

  const diffMs = Date.now() - timestamp;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

const getSortValue = (value?: number | null, fallback = 0) =>
  typeof value === 'number' ? value : fallback;

export default function GitHub() {
  const repositoryState = useRepositoryStats();
  const [query, setQuery] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedSignals, setSelectedSignals] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityFilter>('all');
  const [originFilter, setOriginFilter] = useState<OriginFilter>('all');
  const [activityFilter, setActivityFilter] =
    useState<ActivityFilter>('all');
  const [readmeFilter, setReadmeFilter] = useState<ReadmeFilter>('all');
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const [showAllSignals, setShowAllSignals] = useState(false);

  const getRepositoryDetailPath = (repo: Repository) =>
    `/github/repositories/${encodeURIComponent(repo.name)}`;

  const lastUpdated = useMemo(() => {
    const dateStrings: string[] = [];

    const metadataDate = repositoryState.metadata?.generated_at;
    if (typeof metadataDate === 'string') {
      dateStrings.push(metadataDate);
    }

    repositoryState.data.forEach((repo) => {
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
  }, [repositoryState.data, repositoryState.metadata]);

  const quickStats = useMemo(() => {
    const totals = repositoryState.data.reduce(
      (acc, repo) => {
        acc.repos += 1;
        acc.stars += repo.stars ?? 0;
        acc.forks += repo.forks ?? 0;
        acc.commits += repo.total_commits ?? 0;
        if ((getDaysSinceLastUpdate(repo) ?? Infinity) <= 90) {
          acc.active90 += 1;
        }
        return acc;
      },
      { repos: 0, stars: 0, forks: 0, commits: 0, active90: 0 },
    );

    return totals;
  }, [repositoryState.data]);

  const languageOptions = useMemo(() => {
    const counts = new Map<string, number>();

    repositoryState.data.forEach((repo) => {
      getRepositoryLanguages(repo).forEach((language) => {
        counts.set(language, (counts.get(language) ?? 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([language]) => language);
  }, [repositoryState.data]);

  const signalOptions = useMemo(() => {
    const counts = new Map<string, number>();

    repositoryState.data.forEach((repo) => {
      getRepositorySignals(repo).forEach((signal) => {
        counts.set(signal, (counts.get(signal) ?? 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([signal]) => signal);
  }, [repositoryState.data]);

  const filteredRepositories = useMemo(() => {
    const tokens = query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return repositoryState.data.filter((repo) => {
      if (visibilityFilter === 'private' && !repo.is_private) {
        return false;
      }
      if (visibilityFilter === 'public' && repo.is_private) {
        return false;
      }
      if (originFilter === 'forks' && !repo.is_fork) {
        return false;
      }
      if (originFilter === 'sources' && repo.is_fork) {
        return false;
      }
      if (readmeFilter === 'readme' && !repo.has_readme) {
        return false;
      }

      const daysSinceUpdate = getDaysSinceLastUpdate(repo);
      if (activityFilter !== 'all') {
        if (daysSinceUpdate === null) {
          return false;
        }
        if (activityFilter === 'active-30' && daysSinceUpdate > 30) {
          return false;
        }
        if (activityFilter === 'active-90' && daysSinceUpdate > 90) {
          return false;
        }
        if (activityFilter === 'active-180' && daysSinceUpdate > 180) {
          return false;
        }
        if (activityFilter === 'active-365' && daysSinceUpdate > 365) {
          return false;
        }
        if (activityFilter === 'stale' && daysSinceUpdate <= 365) {
          return false;
        }
      }

      if (selectedLanguages.length > 0) {
        const repoLanguages = new Set(
          getRepositoryLanguages(repo).map(normalizeTag),
        );
        const matches = selectedLanguages.some((language) =>
          repoLanguages.has(normalizeTag(language)),
        );
        if (!matches) {
          return false;
        }
      }

      if (selectedSignals.length > 0) {
        const repoSignals = new Set(
          getRepositorySignals(repo).map(normalizeTag),
        );
        const matches = selectedSignals.some((signal) =>
          repoSignals.has(normalizeTag(signal)),
        );
        if (!matches) {
          return false;
        }
      }

      if (tokens.length > 0) {
        const haystack = [
          repo.name,
          repo.description ?? '',
          repo.url,
          repo.language ?? '',
          getSummaryText(repo),
          ...getRepositorySignals(repo),
        ]
          .join(' ')
          .toLowerCase();

        if (!tokens.every((token) => haystack.includes(token))) {
          return false;
        }
      }

      return true;
    });
  }, [
    repositoryState.data,
    query,
    visibilityFilter,
    originFilter,
    activityFilter,
    readmeFilter,
    selectedLanguages,
    selectedSignals,
  ]);

  const sortedRepositories = useMemo(() => {
    const sorted = [...filteredRepositories];

    const getUpdatedTime = (repo: Repository) => {
      const updatedAt = getRepositoryUpdatedAt(repo);
      const timestamp = updatedAt ? new Date(updatedAt).getTime() : 0;
      return Number.isNaN(timestamp) ? 0 : timestamp;
    };

    const sorters: Record<SortOption, (a: Repository, b: Repository) => number> =
      {
        recent: (a, b) => getUpdatedTime(b) - getUpdatedTime(a),
        oldest: (a, b) => getUpdatedTime(a) - getUpdatedTime(b),
        stars: (a, b) =>
          getSortValue(b.stars) - getSortValue(a.stars),
        forks: (a, b) =>
          getSortValue(b.forks) - getSortValue(a.forks),
        commits: (a, b) =>
          getSortValue(b.recent_commits_90d ?? b.total_commits ?? 0) -
          getSortValue(a.recent_commits_90d ?? a.total_commits ?? 0),
        velocity: (a, b) =>
          getSortValue(b.commit_velocity) - getSortValue(a.commit_velocity),
        score: (a, b) =>
          getSortValue(b.composite_score) - getSortValue(a.composite_score),
        rank: (a, b) =>
          getSortValue(a.rank, Number.MAX_SAFE_INTEGER) -
          getSortValue(b.rank, Number.MAX_SAFE_INTEGER),
        size: (a, b) =>
          getSortValue(b.size_kb) - getSortValue(a.size_kb),
        name: (a, b) => a.name.localeCompare(b.name),
      };

    sorted.sort(sorters[sortOption]);
    return sorted;
  }, [filteredRepositories, sortOption]);

  const activeFilterCount =
    (query ? 1 : 0) +
    selectedLanguages.length +
    selectedSignals.length +
    (visibilityFilter !== 'all' ? 1 : 0) +
    (originFilter !== 'all' ? 1 : 0) +
    (activityFilter !== 'all' ? 1 : 0) +
    (readmeFilter !== 'all' ? 1 : 0);

  const resetFilters = () => {
    setQuery('');
    setSelectedLanguages([]);
    setSelectedSignals([]);
    setVisibilityFilter('all');
    setOriginFilter('all');
    setActivityFilter('all');
    setReadmeFilter('all');
  };

  const displayedLanguages = showAllLanguages
    ? languageOptions
    : languageOptions.slice(0, 12);
  const displayedSignals = showAllSignals
    ? signalOptions
    : signalOptions.slice(0, 12);

  return (
    <Layout>
      <Seo
        title="GitHub Repository Portfolio | Mark Hazleton"
        description="Explore Mark Hazleton's open-source contributions and GitHub projects. Filter by technology stack, activity metrics, and development patterns across .NET, Azure, and web development repositories."
        keywords="Mark Hazleton GitHub, open source projects, .NET repositories, Azure projects, GitHub portfolio, software development, repository analytics, code samples"
        canonical="/github"
      />
      <section className="section">
        <div className="container-wide">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-secondary/70 via-background to-secondary/40 p-8 md:p-12 animate-fade-up">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                <span className="tag-pill">Live GitHub feed</span>
                <span>Last updated: {lastUpdated ? formatDateShort(lastUpdated) : '--'}</span>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-4">
                Open-Source Portfolio & GitHub Projects
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Navigate my complete repository collection with live metrics. Filter by <strong>technology stack</strong>,{' '}
                <strong>activity patterns</strong>, and <strong>development velocity</strong> to find relevant projects and code samples.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="paper-card p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Total repositories
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {formatNumber(quickStats.repos)}
                  </p>
                </div>
                <div className="paper-card p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Stars collected
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {formatNumber(quickStats.stars)}
                  </p>
                </div>
                <div className="paper-card p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Forks
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {formatNumber(quickStats.forks)}
                  </p>
                </div>
                <div className="paper-card p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Active (90 days)
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {formatNumber(quickStats.active90)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-10">
            <div className="paper-card p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                      Explore repositories
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Search, filter, and sort across the entire dataset.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm text-primary hover:underline underline-offset-2"
                >
                  Clear filters
                </button>
              </div>

              <div className="grid gap-4 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Search repositories
                  </label>
                  <div className="mt-2">
                    <SearchInput
                      value={query}
                      onChange={setQuery}
                      placeholder="Search by name, description, language, or stack signals..."
                    />
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Sort by
                  </label>
                  <select
                    value={sortOption}
                    onChange={(event) =>
                      setSortOption(event.target.value as SortOption)
                    }
                    aria-label="Sort by"
                    className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="recent">Recently updated</option>
                    <option value="oldest">Oldest update</option>
                    <option value="stars">Stars</option>
                    <option value="forks">Forks</option>
                    <option value="commits">Recent commits</option>
                    <option value="velocity">Commit velocity</option>
                    <option value="score">Spark score</option>
                    <option value="rank">Rank</option>
                    <option value="size">Repository size</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>
                <div className="lg:col-span-2">
                  <label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Visibility
                  </label>
                  <select
                    value={visibilityFilter}
                    onChange={(event) =>
                      setVisibilityFilter(event.target.value as VisibilityFilter)
                    }
                    aria-label="Filter by visibility"
                    className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="all">All</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="lg:col-span-2">
                  <label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Origin
                  </label>
                  <select
                    value={originFilter}
                    onChange={(event) =>
                      setOriginFilter(event.target.value as OriginFilter)
                    }
                    aria-label="Filter by origin"
                    className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="all">All</option>
                    <option value="sources">Originals</option>
                    <option value="forks">Forks</option>
                  </select>
                </div>
                <div className="lg:col-span-3">
                  <label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Activity window
                  </label>
                  <select
                    value={activityFilter}
                    onChange={(event) =>
                      setActivityFilter(event.target.value as ActivityFilter)
                    }
                    aria-label="Filter by activity window"
                    className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="all">All time</option>
                    <option value="active-30">Active in 30 days</option>
                    <option value="active-90">Active in 90 days</option>
                    <option value="active-180">Active in 180 days</option>
                    <option value="active-365">Active in 365 days</option>
                    <option value="stale">Stale (365+ days)</option>
                  </select>
                </div>
                <div className="lg:col-span-3">
                  <label className="text-xs uppercase tracking-wide text-muted-foreground">
                    README
                  </label>
                  <select
                    value={readmeFilter}
                    onChange={(event) =>
                      setReadmeFilter(event.target.value as ReadmeFilter)
                    }
                    aria-label="Filter by README presence"
                    className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="all">Any</option>
                    <option value="readme">Has README</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-foreground">
                      Languages
                    </p>
                    {languageOptions.length > 12 && (
                      <button
                        type="button"
                        onClick={() => setShowAllLanguages((prev) => !prev)}
                        className="text-xs text-primary hover:underline underline-offset-2"
                      >
                        {showAllLanguages ? 'Show fewer' : 'Show all'}
                      </button>
                    )}
                  </div>
                  {displayedLanguages.length > 0 ? (
                    <TagFilter
                      tags={displayedLanguages}
                      selectedTags={selectedLanguages}
                      onToggle={(tag) =>
                        setSelectedLanguages((prev) =>
                          prev.includes(tag)
                            ? prev.filter((item) => item !== tag)
                            : [...prev, tag],
                        )
                      }
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No language data available.
                    </p>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-foreground">
                      Focus signals
                    </p>
                    {signalOptions.length > 12 && (
                      <button
                        type="button"
                        onClick={() => setShowAllSignals((prev) => !prev)}
                        className="text-xs text-primary hover:underline underline-offset-2"
                      >
                        {showAllSignals ? 'Show fewer' : 'Show all'}
                      </button>
                    )}
                  </div>
                  {displayedSignals.length > 0 ? (
                    <TagFilter
                      tags={displayedSignals}
                      selectedTags={selectedSignals}
                      onToggle={(tag) =>
                        setSelectedSignals((prev) =>
                          prev.includes(tag)
                            ? prev.filter((item) => item !== tag)
                            : [...prev, tag],
                        )
                      }
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No activity signals detected yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="h-5 w-5 text-primary" />
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                      Repository results
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Showing {sortedRepositories.length} of{' '}
                    {repositoryState.data.length} repositories
                    {activeFilterCount > 0 ? ` (filters applied: ${activeFilterCount})` : ''}.
                  </p>
                </div>
                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {query && <span className="tag-pill">Search</span>}
                    {visibilityFilter !== 'all' && (
                      <span className="tag-pill">{visibilityFilter}</span>
                    )}
                    {originFilter !== 'all' && (
                      <span className="tag-pill">{originFilter}</span>
                    )}
                    {activityFilter !== 'all' && (
                      <span className="tag-pill">{activityFilter}</span>
                    )}
                    {readmeFilter !== 'all' && (
                      <span className="tag-pill">README</span>
                    )}
                    {selectedLanguages.map((language) => (
                      <span key={`lang-${language}`} className="tag-pill">
                        {language}
                      </span>
                    ))}
                    {selectedSignals.map((signal) => (
                      <span key={`signal-${signal}`} className="tag-pill">
                        {signal}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {repositoryState.status === 'loading' && (
                <p className="text-muted-foreground animate-pulse">
                  Loading repository explorer...
                </p>
              )}
              {repositoryState.status === 'error' && (
                <p className="text-muted-foreground">{repositoryState.error}</p>
              )}
              {repositoryState.status === 'success' &&
                sortedRepositories.length === 0 && (
                  <div className="paper-card p-6 text-center">
                    <p className="text-lg text-foreground mb-2">
                      No repositories match these filters.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try clearing filters or broadening your search terms.
                    </p>
                  </div>
                )}
              {repositoryState.status === 'success' &&
                sortedRepositories.length > 0 && (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 stagger-children">
                    {sortedRepositories.map((repo) => {
                      const summarySnippet = getSummarySnippet(repo);
                      const signals = getRepositorySignals(repo);
                      const updatedAt = getRepositoryUpdatedAt(repo);
                      const daysSince = getDaysSinceLastUpdate(repo);
                      const commitCount =
                        repo.recent_commits_90d ?? repo.total_commits ?? 0;

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

                          {signals.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {signals.slice(0, 4).map((signal, index) => (
                                <span
                                  key={`${repo.name}-signal-${index}`}
                                  className="tag-pill"
                                >
                                  {signal}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                            <div className="flex flex-wrap items-center gap-3">
                              <span>
                                {formatNumber(commitCount)} commits
                              </span>
                              {typeof repo.commit_velocity === 'number' && (
                                <span>
                                  {repo.commit_velocity.toFixed(1)}/mo
                                </span>
                              )}
                              {typeof repo.composite_score === 'number' && (
                                <span>
                                  Score {repo.composite_score.toFixed(1)}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                              {typeof repo.stars === 'number' && (
                                <span>{formatNumber(repo.stars)} stars</span>
                              )}
                              {typeof repo.forks === 'number' && (
                                <span>{formatNumber(repo.forks)} forks</span>
                              )}
                              {updatedAt && (
                                <span>
                                  Updated {formatDateShort(updatedAt)}
                                </span>
                              )}
                              {typeof daysSince === 'number' && (
                                <span>{daysSince} days ago</span>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 flex items-center gap-4 text-sm">
                            <Link
                              to={getRepositoryDetailPath(repo)}
                              className="text-primary hover:underline underline-offset-2"
                            >
                              View metrics
                            </Link>
                            <a
                              href={repo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              GitHub
                            </a>
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
