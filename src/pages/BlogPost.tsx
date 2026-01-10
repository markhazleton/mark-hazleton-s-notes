import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { BlogCard } from '@/components/BlogCard';
import { TableOfContents } from '@/components/TableOfContents';
import { Callout } from '@/components/Callout';
import { Button } from '@/components/ui/button';
import { posts } from '@/data/posts';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Get related posts (same tags, different post)
  const relatedPosts = posts
    .filter((p) => p.slug !== post.slug && p.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 3);

  // Mock table of contents
  const tocItems = [
    { id: 'section-1', title: 'The Fallacy of "Highly Available"', level: 2 },
    { id: 'section-2', title: 'Design Principles That Actually Work', level: 2 },
    { id: 'section-3', title: 'Real Talk: What Goes Wrong', level: 2 },
  ];

  return (
    <Layout>
      <article className="section">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              to="/blog"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to blog
            </Link>

            {/* Header */}
            <header className="mb-8 animate-fade-up">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blog?tag=${tag}`}
                    className="tag-pill hover:tag-pill-active"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {post.readingTime} read
                </span>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              <p className="text-xl text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            </header>

            {/* Content Layout */}
            <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-8">
              {/* Main Content */}
              <div className="prose-blog">
                {post.content ? (
                  <>
                    {post.content.split('\n\n').map((paragraph, index) => {
                      if (paragraph.startsWith('## ')) {
                        return (
                          <h2 key={index} id={`section-${index}`}>
                            {paragraph.replace('## ', '')}
                          </h2>
                        );
                      }
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h3 key={index}>
                            {paragraph.replace('### ', '')}
                          </h3>
                        );
                      }
                      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        return (
                          <Callout key={index} type="tip" title="Key Insight">
                            {paragraph.replace(/\*\*/g, '')}
                          </Callout>
                        );
                      }
                      if (paragraph.startsWith('- ')) {
                        const items = paragraph.split('\n');
                        return (
                          <ul key={index}>
                            {items.map((item, i) => (
                              <li key={i}>{item.replace('- ', '')}</li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={index}>{paragraph}</p>;
                    })}
                  </>
                ) : (
                  <>
                    <p>
                      This is a placeholder for the full blog post content. In a real implementation, 
                      this would be loaded from MDX files or a content management system.
                    </p>

                    <Callout type="info" title="Note">
                      The content structure is ready for MDX or any markdown-based content pipeline.
                    </Callout>

                    <h2 id="section-1">Getting Started</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                      quis nostrud exercitation ullamco laboris.
                    </p>

                    <h2 id="section-2">Key Concepts</h2>
                    <p>
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                      eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                    </p>

                    <div className="code-block">
                      <code>
                        {`// Example code block
const config = {
  resilience: true,
  retries: 3,
  timeout: 5000
};`}
                      </code>
                    </div>

                    <h2 id="section-3">Conclusion</h2>
                    <p>
                      Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut 
                      perspiciatis unde omnis iste natus error sit voluptatem accusantium.
                    </p>
                  </>
                )}
              </div>

              {/* Sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <TableOfContents items={tocItems} />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section bg-muted/30 border-t border-border">
          <div className="container-wide">
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-8">
              Related posts
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
