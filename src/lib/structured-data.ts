import { SITE_NAME, SITE_URL } from "./site";

export type BlogPostingSchema = {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  headline: string;
  description: string;
  author: {
    "@type": "Person";
    name: string;
    url: string;
  };
  datePublished: string;
  dateModified?: string;
  publisher: {
    "@type": "Person";
    name: string;
  };
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
  image?: string;
  keywords?: string;
  articleSection?: string;
  wordCount?: number;
  timeRequired?: string;
};

export type PersonSchema = {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  url: string;
  jobTitle: string;
  description: string;
  sameAs?: string[];
};

export type WebSiteSchema = {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
};

export type BreadcrumbListSchema = {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
};

export function createBlogPostingSchema(data: {
  title: string;
  description: string;
  slug: string;
  publishedDate: string;
  lastmod?: string;
  author?: string;
  keywords?: string;
  section?: string;
  estimatedReadTime?: number;
  image?: string;
}): BlogPostingSchema {
  const url = `${SITE_URL}/${data.slug}`;
  const author = data.author || "Mark Hazleton";

  const schema: BlogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.description,
    author: {
      "@type": "Person",
      name: author,
      url: SITE_URL,
    },
    datePublished: data.publishedDate,
    publisher: {
      "@type": "Person",
      name: SITE_NAME,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  if (data.lastmod) {
    schema.dateModified = data.lastmod;
  }

  if (data.image) {
    schema.image = data.image.startsWith("http")
      ? data.image
      : `${SITE_URL}${data.image}`;
  }

  if (data.keywords) {
    schema.keywords = data.keywords;
  }

  if (data.section) {
    schema.articleSection = data.section;
  }

  if (data.estimatedReadTime) {
    schema.timeRequired = `PT${data.estimatedReadTime}M`;
  }

  return schema;
}

export function createPersonSchema(data: {
  name: string;
  url: string;
  jobTitle: string;
  description: string;
  sameAs?: string[];
}): PersonSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.name,
    url: data.url,
    jobTitle: data.jobTitle,
    description: data.description,
    ...(data.sameAs && { sameAs: data.sameAs }),
  };
}

export function createWebSiteSchema(data: {
  name: string;
  url: string;
  description: string;
  searchUrl?: string;
}): WebSiteSchema {
  const schema: WebSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: data.name,
    url: data.url,
    description: data.description,
  };

  if (data.searchUrl) {
    schema.potentialAction = {
      "@type": "SearchAction",
      target: `${data.searchUrl}{search_term_string}`,
      "query-input": "required name=search_term_string",
    };
  }

  return schema;
}

export function createBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): BreadcrumbListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
