import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { BlogCard } from '@/components/BlogCard';
import { SearchInput } from '@/components/SearchInput';
import { TagFilter } from '@/components/TagFilter';
import { posts, allTags } from '@/lib/data/posts';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Seo } from '@/components/Seo';
import { createBreadcrumbSchema } from '@/lib/structured-data';
import { SITE_URL } from '@/lib/site';

const parseTagsFromSearch = (search: string) => {
  if (!search) {
    return [];
  }

  const params = new URLSearchParams(search);
  const rawTags = params.getAll('tag');

  return rawTags
    .flatMap((tagList) => tagList.split(','))
    .map((tag) => tag.trim())
    .filter(Boolean);
};

export default function Blog() {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortNewest, setSortNewest] = useState(true);
  
  // Parse tags from URL on each render when location.search changes
  const selectedTags = parseTagsFromSearch(location.search);

  const filteredPosts = useMemo(() => {
    let result = posts;

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter((post) => {
        const haystack = [post.title, post.excerpt, post.keywords]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(searchLower);
      });
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter((post) =>
        selectedTags.some((tag) => post.tags.includes(tag))
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortNewest ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [search, selectedTags, sortNewest]);

  const toggleTag = (tag: string) => {
    const currentTags = parseTagsFromSearch(location.search);
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    
    const params = new URLSearchParams();
    newTags.forEach((t) => params.append('tag', t));
    navigate({ search: params.toString() }, { replace: true });
  };

  // Add breadcrumb schema
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
  ]);

  return (
    <Layout>
      <Seo
        title="Cloud Architecture Blog | Mark Hazleton"
        description="Practical insights on cloud architecture, .NET development, Azure infrastructure, and system design. Technical articles for software architects and engineering teams."
        keywords="cloud architecture blog, Azure tutorials, .NET best practices, system design patterns, software architecture, integration patterns, distributed systems, Mark Hazleton"
        canonical="/blog"
        jsonLd={breadcrumbSchema}
      />
      <section className="section">
        <div className="container-wide">
          {/* Header */}
          <div className="max-w-2xl mb-10 animate-fade-up">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
              Cloud Architecture & Engineering Insights
            </h1>
            <p className="text-lg text-muted-foreground">
              Practical notes on <strong>cloud architecture</strong>, <strong>Azure</strong>, <strong>.NET development</strong>, 
              <strong> integration patterns</strong>, and engineering practices. Written for builders solving real problems.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 max-w-md">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search posts..."
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortNewest(!sortNewest)}
                className="self-start sm:self-auto"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {sortNewest ? 'Newest first' : 'Oldest first'}
              </Button>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Filter by topic:</p>
              <TagFilter
                tags={allTags}
                selectedTags={selectedTags}
                onToggle={toggleTag}
              />
            </div>
          </div>

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-children">
              {filteredPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No posts found matching your criteria.
              </p>
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => {
                  setSearch('');
                  navigate({ search: '' }, { replace: true });
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
