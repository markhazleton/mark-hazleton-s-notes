import { useEffect, useMemo, useState, isValidElement } from 'react';
import type { ReactNode } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { BlogCard } from '@/components/BlogCard';
import { TableOfContents } from '@/components/TableOfContents';
import { Button } from '@/components/ui/button';
import { posts } from '@/lib/data/posts';
import { Seo } from '@/components/Seo';
import { formatDateLong } from '@/lib/date';

type MarkdownState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  content: string;
  error: string | null;
};

type TocItem = {
  id: string;
  title: string;
  level: number;
};

const markdownModules = import.meta.glob('../content/*.md', {
  query: '?raw',
  import: 'default',
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getPlainText = (node: ReactNode): string => {
  if (typeof node === 'string') {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(getPlainText).join('');
  }

  if (isValidElement(node)) {
    return getPlainText(node.props.children);
  }

  return '';
};

const extractHeadings = (markdown: string): TocItem[] => {
  const headings: TocItem[] = [];
  const lines = markdown.split('\n');
  let inCodeBlock = false;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return;
    }

    if (inCodeBlock) {
      return;
    }

    const match = /^(#{2,3})\s+(.+)/.exec(trimmed);
    if (!match) {
      return;
    }

    const level = match[1].length;
    const title = match[2].replace(/\s+#+\s*$/, '').trim();
    const id = slugify(title);

    if (id) {
      headings.push({ id, title, level });
    }
  });

  return headings;
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);
  const contentFile = post?.contentFile;
  const [markdownState, setMarkdownState] = useState<MarkdownState>({
    status: 'idle',
    content: '',
    error: null,
  });

  useEffect(() => {
    if (!contentFile) {
      return undefined;
    }

    let isActive = true;
    const loadMarkdown = async () => {
      const markdownPath = `../content/${contentFile}`;
      const loader = markdownModules[markdownPath];

      if (!loader) {
        if (isActive) {
          setMarkdownState({
            status: 'error',
            content: '',
            error: 'Content unavailable for this article.',
          });
        }
        return;
      }

      setMarkdownState({ status: 'loading', content: '', error: null });

      try {
        const content = await loader();
        if (isActive) {
          setMarkdownState({ status: 'success', content, error: null });
        }
      } catch (error) {
        if (isActive) {
          setMarkdownState({
            status: 'error',
            content: '',
            error: 'Unable to load this article right now.',
          });
        }
      }
    };

    void loadMarkdown();

    return () => {
      isActive = false;
    };
  }, [contentFile]);

  const tocItems = useMemo(
    () => extractHeadings(markdownState.content),
    [markdownState.content]
  );

  const relatedPosts = useMemo(() => {
    if (!post) {
      return [];
    }

    return posts
      .filter((p) => p.slug !== post.slug && p.tags.some((tag) => post.tags.includes(tag)))
      .slice(0, 3);
  }, [post]);

  const markdownComponents = useMemo(
    () => ({
      h2({ children }: { children: ReactNode }) {
        const text = getPlainText(children);
        const id = slugify(text);
        return <h2 id={id}>{children}</h2>;
      },
      h3({ children }: { children: ReactNode }) {
        const text = getPlainText(children);
        const id = slugify(text);
        return <h3 id={id}>{children}</h3>;
      },
      pre({ children }: { children: ReactNode }) {
        return <pre className="code-block">{children}</pre>;
      },
      code({
        inline,
        className,
        children,
      }: {
        inline?: boolean;
        className?: string;
        children: ReactNode;
      }) {
        if (inline) {
          return <code className="inline-code">{children}</code>;
        }
        return <code className={className}>{children}</code>;
      },
    }),
    []
  );

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const keywordList = post.keywords || post.tags.join(", ");
  const canonicalPath = `/blog/${post.slug}`;

  return (
    <Layout>
      <Seo
        title={`${post.title} | Mark Hazleton`}
        description={post.excerpt}
        keywords={keywordList}
        canonical={canonicalPath}
        image={post.image ?? undefined}
        type="article"
      />
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
                  {formatDateLong(post.date)}
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
                {markdownState.status === 'loading' && (
                  <p className="text-muted-foreground animate-pulse">
                    Loading article content...
                  </p>
                )}
                {markdownState.status === 'error' && (
                  <p className="text-muted-foreground">{markdownState.error}</p>
                )}
                {markdownState.status === 'success' && markdownState.content && (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {markdownState.content}
                  </ReactMarkdown>
                )}
                {markdownState.status === 'success' && !markdownState.content && (
                  <p className="text-muted-foreground">
                    Content is not available for this article yet.
                  </p>
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
