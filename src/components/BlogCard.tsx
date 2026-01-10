import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import type { Post } from '@/data/posts';

interface BlogCardProps {
  post: Post;
  variant?: 'default' | 'compact';
}

export function BlogCard({ post, variant = 'default' }: BlogCardProps) {
  if (variant === 'compact') {
    return (
      <Link 
        to={`/blog/${post.slug}`}
        className="group block py-4 border-b border-border last:border-0 transition-colors hover:bg-muted/30"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-lg font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readingTime}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="tag-pill text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/blog/${post.slug}`}
      className="group block paper-card p-6 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex flex-wrap gap-1.5 mb-3">
        {post.tags.map((tag) => (
          <span key={tag} className="tag-pill">
            {tag}
          </span>
        ))}
      </div>
      
      <h3 className="font-heading text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
        {post.title}
      </h3>
      
      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
        {post.excerpt}
      </p>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          {new Date(post.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {post.readingTime}
        </span>
      </div>
    </Link>
  );
}
