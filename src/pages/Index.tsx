import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Cloud, Workflow, Server, Sparkles } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { FeatureCard } from '@/components/FeatureCard';
import { BlogCard } from '@/components/BlogCard';
import { Toolbox } from '@/components/Toolbox';
import { Button } from '@/components/ui/button';
import { posts } from '@/lib/data/posts';
import { useRepositoryStats } from '@/hooks/use-repository-stats';
import type { Repository } from '@/types/repositories';
import { Seo } from '@/components/Seo';
import { DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS, DEFAULT_TITLE } from '@/lib/site';
import { formatDateShort } from '@/lib/date';

const howIWork = [
  {
    title: 'Start with discovery',
    description: 'Understanding the problem deeply before proposing solutions. The best architecture comes from understanding the business context.',
  },
  {
    title: 'Embrace constraints',
    description: 'Constraints aren\'t obstacles-they\'re design inputs. Budget, timeline, team skills, and existing systems all shape the right solution.',
  },
  {
    title: 'Make tradeoffs explicit',
    description: 'Every architectural decision involves tradeoffs. I document them clearly so teams can make informed choices.',
  },
  {
    title: 'Document for the future',
    description: 'Architecture decisions should be understandable by someone joining the team in two years. I write ADRs and keep documentation current.',
  },
  {
    title: 'Ship incrementally',
    description: 'Big-bang releases are risky. I prefer incremental delivery that provides value early and often while reducing risk.',
  },
];

export default function Index() {
  const repositoryState = useRepositoryStats();
  const latestPosts = posts.slice(0, 6);

  const getMostRecentRepository = (repositories: Repository[]) => {
    let latestRepo: Repository | null = null;
    let latestDate: Date | null = null;

    repositories.forEach((repo) => {
      const candidateDates = [
        repo.last_commit_date,
        repo.updated_at,
        repo.pushed_at,
        repo.created_at,
      ]
        .map((value) => (value ? new Date(value) : null))
        .filter((value): value is Date => Boolean(value && !Number.isNaN(value.getTime())));

      if (candidateDates.length === 0) {
        return;
      }

      const repoLatest = candidateDates.sort((a, b) => b.getTime() - a.getTime())[0];
      if (!latestDate || repoLatest.getTime() > latestDate.getTime()) {
        latestDate = repoLatest;
        latestRepo = repo;
      }
    });

    return { repo: latestRepo, date: latestDate };
  };

  const latestRepositoryInfo = useMemo(
    () => getMostRecentRepository(repositoryState.data),
    [repositoryState.data],
  );

  const githubUpdated = useMemo(() => {
    const dates: Date[] = [];
    if (latestRepositoryInfo.date) {
      dates.push(latestRepositoryInfo.date);
    }
    if (repositoryState.metadata?.generated_at) {
      const parsed = new Date(repositoryState.metadata.generated_at as string);
      if (!Number.isNaN(parsed.getTime())) {
        dates.push(parsed);
      }
    }

    return dates.sort((a, b) => b.getTime() - a.getTime())[0] ?? null;
  }, [latestRepositoryInfo.date, repositoryState.metadata]);

  return (
    <Layout>
      <Seo
        title={DEFAULT_TITLE}
        description={DEFAULT_DESCRIPTION}
        keywords={DEFAULT_KEYWORDS}
        canonical="/"
      />
      {/* Hero Section */}
      <section className="section border-b border-border">
        <div className="container-wide">
          <div className="max-w-3xl animate-fade-up">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Hi, I'm Mark.
              <span className="block text-primary">I build systems that scale.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              Technical Solutions Architect helping teams design resilient cloud architectures, 
              integration patterns, and engineering practices. I write about what I learn along the way.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/blog">
                  Read the blog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">
                  Say hello
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section">
        <div className="container-blog">
          <div className="animate-fade-up">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6">
              About Mark
            </h2>

            <div className="prose-blog text-lg">
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                I'm Mark Hazleton, a Technical Solutions Architect with a passion for 
                building systems that are resilient, maintainable, and actually solve 
                real problems.
              </p>

              <p>
                For the past 15+ years, I've been helping teams design and build distributed 
                systems across healthcare, retail, and financial services. I've seen patterns 
                that work and patterns that fail spectacularly. I write about both.
              </p>

              <p>
                My approach is pragmatic rather than dogmatic. The "right" architecture depends 
                on your constraints, your team, and your business context. I'm more interested 
                in solving problems than following frameworks for their own sake.
              </p>

              <p>
                When I'm not architecting systems, I'm probably reading about distributed systems 
                theory, experimenting with new cloud services, or trying to explain to my family 
                what exactly I do for a living.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <h3 className="font-heading text-2xl font-semibold text-foreground mb-6">
              How I work
            </h3>
            <div className="space-y-4">
              {howIWork.map((item, index) => (
                <div 
                  key={item.title}
                  className="flex gap-4 p-4 paper-card"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-1">
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h3 className="font-heading text-2xl font-semibold text-foreground mb-6">
              My toolbox
            </h3>
            <p className="text-muted-foreground mb-6">
              Technologies and practices I work with regularly. The right tool depends on the problem.
            </p>
            <Toolbox />
          </div>

          <div className="mt-16">
            <h3 className="font-heading text-2xl font-semibold text-foreground mb-6">
              Background
            </h3>
            <div className="prose-blog">
              <p>
                I started my career as a developer, building line-of-business applications 
                in .NET. Over time, I became increasingly interested in how systems fit 
                together-the integration patterns, the failure modes, the operational 
                characteristics that determine whether a system thrives or struggles in production.
              </p>
              <p>
                That curiosity led me into architecture roles, where I could think about 
                systems holistically. I've led architecture practices, built platform teams, 
                and consulted for organizations ranging from startups to enterprises.
              </p>
              <p>
                These days, I focus on cloud-native architectures, particularly on Azure. 
                I'm especially interested in event-driven systems, observability, and the 
                organizational patterns that enable teams to build and operate complex systems 
                sustainably.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Areas */}
      <section className="section bg-muted/30">
        <div className="container-wide">
          <div className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
              What I write about
            </h2>
            <p className="text-muted-foreground">
              Practical insights from building and scaling production systems.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 stagger-children">
            <FeatureCard
              title="Architecture Notes"
              description="Patterns, tradeoffs, and lessons learned from designing distributed systems at scale."
              icon={Server}
              href="/blog?tag=Architecture"
              color="primary"
            />
            <FeatureCard
              title="Azure & Cloud"
              description="Deep dives into Azure services, cloud-native patterns, and infrastructure as code."
              icon={Cloud}
              href="/blog?tag=Azure"
              color="accent"
            />
            <FeatureCard
              title="Integration & APIs"
              description="Building robust integrations, API design, and event-driven architectures."
              icon={Workflow}
              href="/blog?tag=APIs"
              color="muted"
            />
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="section">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-1">
                Latest posts
              </h2>
              <p className="text-muted-foreground text-sm">
                Fresh thoughts and technical deep-dives.
              </p>
            </div>
            <Link 
              to="/blog"
              className="hidden sm:inline-flex items-center text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              View all posts
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="paper-card divide-y divide-border">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} post={post} variant="compact" />
            ))}
          </div>
          
          <div className="mt-6 sm:hidden">
            <Link 
              to="/blog"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              View all posts
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* GitHub Strip */}
      <section className="py-12 bg-primary/5 border-y border-primary/10">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground">GitHub activity</h3>
                <p className="text-sm text-muted-foreground">
                  Updated {githubUpdated ? formatDateShort(githubUpdated) : '--'}
                </p>
              </div>
            </div>
            <div className="flex-1 text-muted-foreground">
              <div className="flex flex-col gap-2 text-sm">
                {latestRepositoryInfo.repo ? (
                  <span>
                    Latest repository update:{' '}
                    <Link
                      to={`/github/repositories/${encodeURIComponent(latestRepositoryInfo.repo.name)}`}
                      className="text-primary hover:underline underline-offset-2"
                    >
                      {latestRepositoryInfo.repo.name}
                    </Link>
                    {latestRepositoryInfo.date && (
                      <span className="text-muted-foreground">
                        {' '}
                        on {formatDateShort(latestRepositoryInfo.date)}
                      </span>
                    )}
                  </span>
                ) : (
                  <span>
                    Latest repository update:{' '}
                    {repositoryState.status === 'loading' ? 'Loading...' : 'Unavailable'}
                  </span>
                )}
                <Link to="/github" className="text-primary hover:underline underline-offset-2">
                  See the full GitHub activity
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
