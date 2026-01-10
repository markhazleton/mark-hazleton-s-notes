import { useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { BlogCard } from '@/components/BlogCard';
import { SearchInput } from '@/components/SearchInput';
import { TagFilter } from '@/components/TagFilter';
import { posts, allTags } from '@/data/posts';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Blog() {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortNewest, setSortNewest] = useState(true);

  const filteredPosts = useMemo(() => {
    let result = posts;

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower)
      );
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
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <Layout>
      <section className="section">
        <div className="container-wide">
          {/* Header */}
          <div className="max-w-2xl mb-10 animate-fade-up">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
              Blog
            </h1>
            <p className="text-lg text-muted-foreground">
              Practical notes on cloud architecture, integration patterns, and 
              engineering practices. Written for builders.
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
                  setSelectedTags([]);
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
