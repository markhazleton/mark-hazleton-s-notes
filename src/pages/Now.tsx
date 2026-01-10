import { useEffect, useMemo, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Callout } from '@/components/Callout';
import { BookOpen, Code, Users, MapPin, GitBranch } from 'lucide-react';

const REPOSITORY_STATS_URL =
  'https://raw.githubusercontent.com/markhazleton/github-stats-spark/main/data/repositories.json';

type Repository = {
  name: string;
  description?: string | null;
  url: string;
  stars: number;
  forks: number;
  language?: string | null;
  updated_at?: string;
  last_commit_date?: string;
  total_commits?: number;
  recent_commits_90d?: number;
};

type RepositoryStatsPayload = {
  repositories: Repository[];
};

type RepositoryStatus = 'idle' | 'loading' | 'success' | 'error';

type RepositoryState = {
  status: RepositoryStatus;
  data: Repository[];
  error: string | null;
};

export default function Now() {
  const [repositoryState, setRepositoryState] = useState<RepositoryState>({
    status: 'idle',
    data: [],
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    const loadRepositories = async () => {
      setRepositoryState((prev) => ({
        ...prev,
        status: 'loading',
        error: null,
      }));

      try {
        const response = await fetch(REPOSITORY_STATS_URL, {
          signal: controller.signal,
          cache: 'no-store',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }

        const payload = (await response.json()) as RepositoryStatsPayload;
        const repositories = Array.isArray(payload.repositories)
          ? payload.repositories
          : [];

        setRepositoryState({
          status: 'success',
          data: repositories,
          error: null,
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setRepositoryState({
          status: 'error',
          data: [],
          error: 'Unable to load repository updates right now.',
        });
      }
    };

    void loadRepositories();

    return () => controller.abort();
  }, []);

  const recentRepositories = useMemo(
    () => repositoryState.data.slice(0, 6),
    [repositoryState.data],
  );

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

  return (
    <Layout>
      <section className="section">
        <div className="container-blog">
          <div className="animate-fade-up">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
              What I'm Doing Now
            </h1>
            <p className="text-muted-foreground mb-2">
              Last updated: January 2024
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
                      const lastUpdate = repo.last_commit_date ?? repo.updated_at;
                      const recentCommits = repo.recent_commits_90d;
                      const totalCommits = repo.total_commits;

                      return (
                        <a
                          key={repo.name}
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
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
                            {repo.language && (
                              <span className="tag-pill">{repo.language}</span>
                            )}
                          </div>
                          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            {typeof recentCommits === 'number' && (
                              <span>{recentCommits} commits (90d)</span>
                            )}
                            {typeof recentCommits !== 'number' &&
                              typeof totalCommits === 'number' && (
                                <span>{totalCommits} total commits</span>
                              )}
                            <span>Updated {formatDate(lastUpdate)}</span>
                            <span>{repo.stars} stars</span>
                            <span>{repo.forks} forks</span>
                          </div>
                        </a>
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
                Based in the Dallas-Fort Worth area, working remotely. Occasionally 
                traveling for conferences and client work.
              </p>
            </div>

            <Callout type="info" title="Want to connect?">
              If any of these topics resonate with you, I'd love to chat. The best way 
              to reach me is through the{' '}
              <a href="/contact" className="text-primary hover:underline">contact page</a>.
            </Callout>
          </div>
        </div>
      </section>
    </Layout>
  );
}
