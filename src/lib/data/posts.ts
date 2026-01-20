import articlesData from '@/data/articles.json';
import { withBasePath } from '@/lib/site';

type ArticleEntry = {
  id: number;
  Section: string;
  slug: string;
  name: string;
  contentFile: string;
  description: string;
  keywords: string;
  img_src?: string | null;
  lastmod?: string;
  publishedDate: string;
  estimatedReadTime: number;
  changefreq?: string;
  source: string;
  subtitle?: string;
  author?: string;
  summary?: string;
};

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tags: string[];
  featured?: boolean;
  contentFile: string;
  source: string;
  section: string;
  keywords: string;
  image?: string | null;
}

const rawArticles = articlesData as ArticleEntry[];

const normalizeDate = (value?: string) => {
  if (!value) {
    return '1970-01-01';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '1970-01-01';
  }

  return parsed.toISOString().slice(0, 10);
};

const buildSlug = (entry: ArticleEntry) => {
  if (entry.contentFile) {
    return entry.contentFile.replace(/\.md$/i, '');
  }

  return entry.slug.replace(/^articles\//, '').replace(/\.html$/i, '');
};

const stripMarkdown = (value: string) =>
  value
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#+\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/[_~]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^"+/, '')
    .replace(/"+$/, '')
    .trim();

const buildExcerpt = (entry: ArticleEntry) =>
  stripMarkdown(entry.summary?.trim() || entry.description.trim());

const buildReadingTime = (minutes: number) => {
  const safeMinutes = Number.isFinite(minutes) ? Math.max(1, Math.round(minutes)) : 5;
  return `${safeMinutes} min`;
};

const buildTags = (entry: ArticleEntry) => [entry.Section];

export const posts: Post[] = rawArticles
  .filter((entry) => 
    entry.contentFile && 
    entry.contentFile !== 'articles.md' &&
    !entry.contentFile.startsWith('_')
  )
  .map((entry) => ({
    slug: buildSlug(entry),
    title: entry.name,
    excerpt: buildExcerpt(entry),
    date: normalizeDate(entry.publishedDate || entry.lastmod),
    readingTime: buildReadingTime(entry.estimatedReadTime),
    tags: buildTags(entry),
    contentFile: entry.contentFile,
    source: entry.source,
    section: entry.Section,
    keywords: entry.keywords,
    image: withBasePath(entry.img_src),
  }))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const allTags = Array.from(new Set(posts.flatMap((post) => post.tags))).sort();

export const featuredPosts = posts.slice(0, 6);
