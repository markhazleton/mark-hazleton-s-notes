import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Cloud, Workflow, Server, Sparkles } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { FeatureCard } from '@/components/FeatureCard';
import { BlogCard } from '@/components/BlogCard';
import { FeaturedProjectCard } from '@/components/FeaturedProjectCard';
import { Toolbox } from '@/components/Toolbox';
import { Button } from '@/components/ui/button';
import { posts } from '@/lib/data/posts';
import { featuredProjects } from '@/lib/data/projects';
import { useRepositoryStats } from '@/hooks/use-repository-stats';
import type { Repository } from '@/types/repositories';
import { Seo } from '@/components/Seo';
import { DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS, DEFAULT_TITLE, SITE_URL, SITE_NAME } from '@/lib/site';
import { formatDateShort } from '@/lib/date';
import { createPersonSchema, createWebSiteSchema } from '@/lib/structured-data';

export default function Index() {
  const repositoryState = useRepositoryStats();
  const latestPosts = posts.slice(0, 6);

  // Generate structured data schemas for SEO
  const personSchema = createPersonSchema({
    name: "Mark Hazleton",
    url: SITE_URL,
    jobTitle: "Technical Solutions Architect",
    description: DEFAULT_DESCRIPTION,
    sameAs: [
      "https://github.com/markhazleton",
      "https://www.linkedin.com/in/markhazleton",
      "https://www.youtube.com/@MarkHazleton"
    ],
  });

  const webSiteSchema = createWebSiteSchema({
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    searchUrl: `${SITE_URL}/blog?search=`,
  });

  const schemas = [personSchema, webSiteSchema];

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
        jsonLd={personSchema}
      />
      {/* Hero Section */}
      <section className="section border-b border-border">
        <div className="container-wide">
          <div className="max-w-3xl animate-fade-up">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
              Mark Hazleton – Technical Solutions Architect
            </h1>
            <p className="font-heading text-2xl sm:text-3xl font-semibold text-primary mb-6">
              Scalable System Architecture for Healthcare & Enterprise
            </p>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              Technical Solutions Architect specializing in <strong>.NET</strong>, <strong>Azure</strong>, and <strong>resilient system design</strong>. 
              I help business leaders and engineering teams design scalable cloud architectures, build robust API patterns, 
              and implement AI-driven solutions that deliver measurable outcomes. My work connects strategy, cloud infrastructure, 
              and practical engineering to build systems that stay reliable when the stakes are high.
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
      <section className="section border-b border-border">
        <div className="container-wide">
          <div className="animate-fade-up">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6">
              About Mark
            </h2>

            <div className="prose-blog text-lg">
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                I'm Mark Hazleton, a <strong>Technical Solutions Architect</strong> specializing in resilient systems at scale.
              </p>

              <h3 className="font-heading text-2xl font-semibold text-foreground mb-4 mt-8">
                Expertise
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Cloud Architecture:</strong> Azure infrastructure design, .NET solutions, API design patterns</li>
                <li><strong>System Reliability:</strong> Designing for resilience under load and failure scenarios</li>
                <li><strong>Integration Patterns:</strong> Data flow, event-driven architectures, distributed systems</li>
                <li><strong>Healthcare & Enterprise:</strong> Compliance-aware solutions for regulated industries</li>
                <li><strong>AI-Driven Systems:</strong> Practical AI integration and observability-first design</li>
              </ul>

              <h3 className="font-heading text-2xl font-semibold text-foreground mb-4 mt-8">
                Experience
              </h3>
              <p>
                For over 15 years, I've worked across <strong>healthcare</strong>, <strong>financial services</strong>, and complex 
                <strong> enterprise environments</strong> where downtime, bad data, or poor integration creates real-world 
                consequences. I've designed platforms that route millions of transactions, coordinate 
                distributed teams, and keep critical workflows running when things inevitably go wrong.
              </p>

              <h3 className="font-heading text-2xl font-semibold text-foreground mb-4 mt-8">
                Philosophy
              </h3>
              <p>
                <strong>Pragmatic, constraint-aware design.</strong> There is no "perfect" architecture, only the one that fits 
                your constraints, your risk tolerance, and your business goals. I specialize in the space between 
                software and operations — where APIs, cloud infrastructure, security, and people collide. That's where 
                most failures happen, and where good architecture makes the biggest difference.
              </p>

              <p>
                I care less about frameworks and more about whether a system will still work at 2 a.m. when something breaks. 
                I write to capture what actually works, what doesn't, and how teams can build systems that are easier to run, 
                easier to change, and harder to break.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <h3 className="font-heading text-2xl font-semibold text-foreground mb-6">
              What I Help With
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="paper-card p-6">
                <h4 className="font-heading text-lg font-semibold text-foreground mb-2">
                  Azure Architecture & Migration
                </h4>
                <p className="text-muted-foreground">
                  Cloud infrastructure design, Azure resource optimization, and enterprise cloud migration strategies 
                  that minimize risk and downtime.
                </p>
              </div>
              <div className="paper-card p-6">
                <h4 className="font-heading text-lg font-semibold text-foreground mb-2">
                  .NET System Design
                </h4>
                <p className="text-muted-foreground">
                  Scalable .NET architectures, API design patterns, microservices implementation, and modernization 
                  of legacy .NET applications to .NET Core.
                </p>
              </div>
              <div className="paper-card p-6">
                <h4 className="font-heading text-lg font-semibold text-foreground mb-2">
                  Scalable Data & API Patterns
                </h4>
                <p className="text-muted-foreground">
                  Event-driven architectures, integration patterns, distributed systems design, and data flow 
                  optimization for high-volume applications.
                </p>
              </div>
              <div className="paper-card p-6">
                <h4 className="font-heading text-lg font-semibold text-foreground mb-2">
                  Team Capability Building
                </h4>
                <p className="text-muted-foreground">
                  Architecture guidance, technical mentorship, code reviews, and establishing best practices 
                  for engineering teams.
                </p>
              </div>
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
                My path into architecture started in the early 1990s with large consulting firms — 
                EDS and Price Waterhouse — where I learned structured enterprise systems delivery 
                and technical architecture fundamentals. Those years gave me experience building 
                petroleum marketing applications and working within rigorous delivery methodologies.
              </p>
              <p>
                In the late '90s, I shifted to boutique web consulting, working on early digital 
                initiatives like Hilton.com and portal solutions built on platforms like Epicentric 
                and BEA Portal. This was the era when organizations were first figuring out what 
                the web meant for their business — managing client relationships, building ROI cases, 
                and leading delivery teams.
              </p>
              <p>
                From there, I moved through project management roles at firms like Agency.com and 
                FileNet integrators, eventually founding my own consulting practice in 2002. That's 
                when I started specializing in the technical architecture work I still do today — 
                designing web publishing platforms, integration solutions, and cloud-based systems 
                that align with how businesses actually operate.
              </p>
              <p>
                Over the years, I've held roles ranging from Digital Solutions Architect at CEC 
                Entertainment to Senior Software Developer at Baylor Scott & White Health, where 
                I've migrated legacy APIs to modern .NET Core platforms and mentored development 
                teams. I've worked in healthcare, financial services, retail, and entertainment — 
                industries where system failures have real consequences.
              </p>
              <p>
                Today, my focus is on <strong>Azure-based cloud platforms, event-driven architectures, 
                AI-powered systems, and observability-first design</strong> — the foundations required 
                to run large, distributed systems without burning out the people who maintain them. 
                I combine 25+ years of architecture and delivery experience with current technical 
                expertise to help organizations build systems that stay reliable when it matters most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="section border-b border-border">
          <div className="container-wide">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-1">
                  Featured Open Source Packages
                </h2>
                <p className="text-muted-foreground text-sm">
                  NuGet and npm packages I've authored for the developer community.
                </p>
              </div>
              <Link
                to="/projects"
                className="hidden sm:inline-flex items-center text-sm font-medium text-primary hover:underline underline-offset-4"
              >
                View all projects
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <FeaturedProjectCard key={project.id} project={project} />
              ))}
            </div>

            <div className="mt-6 sm:hidden">
              <Link
                to="/projects"
                className="inline-flex items-center text-sm font-medium text-primary hover:underline underline-offset-4"
              >
                View all projects
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest Posts */}
      <section className="section border-b border-border">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-1">
                Latest Architecture & Engineering Posts
              </h2>
              <p className="text-muted-foreground text-sm">
                Cloud architecture insights, .NET best practices, and system design patterns.
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
      <section className="py-12 border-b border-border">
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
