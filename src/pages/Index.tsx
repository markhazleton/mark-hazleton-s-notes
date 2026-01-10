import { Link } from 'react-router-dom';
import { ArrowRight, Cloud, Workflow, Server, Sparkles } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { FeatureCard } from '@/components/FeatureCard';
import { BlogCard } from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { posts } from '@/data/posts';

export default function Index() {
  const latestPosts = posts.slice(0, 6);

  return (
    <Layout>
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

      {/* Now Strip */}
      <section className="py-12 bg-primary/5 border-y border-primary/10">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground">What I'm up to now</h3>
                <p className="text-sm text-muted-foreground">Updated January 2024</p>
              </div>
            </div>
            <div className="flex-1 text-muted-foreground">
              Currently exploring observability patterns with OpenTelemetry and building a reference 
              architecture for event-driven microservices on Azure.{' '}
              <Link to="/now" className="text-primary hover:underline underline-offset-2">
                Read more →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
