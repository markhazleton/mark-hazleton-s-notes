import { Layout } from '@/components/Layout';
import { Seo } from '@/components/Seo';
import { Link } from 'react-router-dom';
import { posts } from '@/lib/data/posts';
import { projects } from '@/lib/data/projects';
import { Map, FileText, FolderOpen, Video, Github, Mail, Home } from 'lucide-react';

export default function Sitemap() {
  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Group posts by section
  const postsBySection = sortedPosts.reduce((acc, post) => {
    const section = post.section || 'General';
    if (!acc[section]) acc[section] = [];
    acc[section].push(post);
    return acc;
  }, {} as Record<string, typeof posts>);

  const mainPages = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/blog', label: 'Blog', icon: FileText },
    { path: '/projects', label: 'Projects', icon: FolderOpen },
    { path: '/github', label: 'GitHub Activity', icon: Github },
    { path: '/videos', label: 'Videos', icon: Video },
    { path: '/contact', label: 'Contact', icon: Mail },
  ];

  return (
    <Layout>
      <Seo
        title="Site Map | Mark Hazleton"
        description="Complete site map of Mark Hazleton's website. Find all blog posts, projects, and pages organized for easy navigation."
        keywords="sitemap, site map, Mark Hazleton, blog posts, projects, navigation"
        canonical="/sitemap"
      />
      <section className="section">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Map className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground">
                  Site Map
                </h1>
                <p className="text-muted-foreground">
                  All pages on this site for easy navigation
                </p>
              </div>
            </div>

            {/* Main Pages */}
            <section className="mb-12">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border">
                Main Pages
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {mainPages.map(({ path, label, icon: Icon }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors text-foreground hover:text-primary"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* Projects */}
            <section className="mb-12">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border">
                Projects ({projects.length})
              </h2>
              <ul className="grid gap-1">
                {projects.map((project) => (
                  <li key={project.slug}>
                    <Link
                      to={`/projects/${project.slug}`}
                      className="block py-2 px-3 rounded-md hover:bg-muted transition-colors text-foreground hover:text-primary"
                    >
                      {project.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* Blog Posts by Section */}
            <section className="mb-12">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border">
                Blog Posts ({posts.length} articles)
              </h2>
              {Object.entries(postsBySection)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([section, sectionPosts]) => (
                  <div key={section} className="mb-8">
                    <h3 className="font-heading text-lg font-medium text-foreground mb-3 text-primary/80">
                      {section} ({sectionPosts.length})
                    </h3>
                    <ul className="grid gap-1 pl-4 border-l-2 border-border">
                      {sectionPosts.map((post) => (
                        <li key={post.slug}>
                          <Link
                            to={`/blog/${post.slug}`}
                            className="block py-1.5 px-3 rounded-md hover:bg-muted transition-colors text-sm text-foreground hover:text-primary"
                          >
                            {post.title}
                            <span className="text-xs text-muted-foreground ml-2">
                              ({new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </section>

            {/* XML Sitemap Link */}
            <section className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                For search engines: <a href="/sitemap.xml" className="text-primary hover:underline">XML Sitemap</a> | <a href="/feed.xml" className="text-primary hover:underline">RSS Feed</a>
              </p>
            </section>
          </div>
        </div>
      </section>
    </Layout>
  );
}
