# Schema.org Structured Data Reference

This document provides examples of the JSON-LD structured data implemented on markhazleton.com.

## BlogPosting Schema
**Used on:** All individual blog post pages (`/blog/{slug}`)

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Avoiding the Sizzle: Staying Focused",
  "description": "Explore how to maintain focus amidst distractions by understanding the allure of superficial attractions and implementing effective techniques.",
  "author": {
    "@type": "Person",
    "name": "Mark Hazleton",
    "url": "https://markhazleton.com"
  },
  "datePublished": "2025-07-12",
  "dateModified": "2023-01-12",
  "publisher": {
    "@type": "Person",
    "name": "Mark Hazleton"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://markhazleton.com/blog/sidetracked-by-sizzle"
  },
  "image": "https://markhazleton.com/img/ArgostoliGreeceBeach.jpg",
  "keywords": "sidetracked, focus, distractions, productivity, mindfulness, goal setting, personal development, time management",
  "articleSection": "Leadership Philosophy",
  "timeRequired": "PT5M"
}
```

**Properties:**
- `headline`: Article title (max 110 characters recommended)
- `description`: Article summary/excerpt
- `author`: Person object with name and URL
- `datePublished`: ISO 8601 date when article was first published
- `dateModified`: ISO 8601 date when article was last updated
- `publisher`: Organization or Person who published the article
- `mainEntityOfPage`: The primary page URL
- `image`: Featured image URL (absolute)
- `keywords`: Comma-separated keywords
- `articleSection`: Content category/section
- `timeRequired`: Reading time in ISO 8601 duration format (PT5M = 5 minutes)

---

## Person Schema
**Used on:** Homepage (`/`)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Mark Hazleton",
  "url": "https://markhazleton.com",
  "jobTitle": "Technical Solutions Architect",
  "description": "Technical Solutions Architect designing resilient .NET and Azure systems for healthcare and enterprise. 15+ years turning complexity into clarity through scalable cloud architecture.",
  "sameAs": [
    "https://github.com/markhazleton",
    "https://www.linkedin.com/in/markhazleton",
    "https://www.youtube.com/@MarkHazleton"
  ]
}
```

**Properties:**
- `name`: Full name
- `url`: Personal website URL
- `jobTitle`: Current professional title
- `description`: Professional bio/summary
- `sameAs`: Array of URLs for verified social profiles

**Benefits:**
- Establishes author identity for content
- Links social profiles to the person
- Enables knowledge graph representation
- Improves author authority for articles

---

## WebSite Schema
**Used on:** Homepage (`/`)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Mark Hazleton",
  "url": "https://markhazleton.com",
  "description": "Technical Solutions Architect designing resilient .NET and Azure systems for healthcare and enterprise. 15+ years turning complexity into clarity through scalable cloud architecture.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://markhazleton.com/blog?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

**Properties:**
- `name`: Website name
- `url`: Homepage URL
- `description`: Site description
- `potentialAction`: Enables sitelinks search box in Google results

**Benefits:**
- Can trigger sitelinks search box in Google results
- Provides context about the site purpose
- Helps establish site authority

---

## BreadcrumbList Schema
**Used on:** All blog posts, project pages, and listing pages

### Example: Blog Post Breadcrumb
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://markhazleton.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://markhazleton.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Avoiding the Sizzle: Staying Focused",
      "item": "https://markhazleton.com/blog/sidetracked-by-sizzle"
    }
  ]
}
```

**Properties:**
- `itemListElement`: Array of ListItem objects
- Each `ListItem` has:
  - `position`: Integer starting from 1
  - `name`: Breadcrumb text
  - `item`: Absolute URL for the breadcrumb

**Benefits:**
- Shows breadcrumb navigation in search results
- Helps search engines understand site structure
- Improves user experience in search results
- Clarifies page hierarchy

---

## Schema Validation

### Google Rich Results Test
Test any URL to verify structured data:
```
https://search.google.com/test/rich-results
```

### Schema.org Validator
Validate JSON-LD syntax and structure:
```
https://validator.schema.org/
```

### Example validation commands:
```bash
# Extract JSON-LD from a page
curl https://markhazleton.com/ | grep -A 50 "application/ld+json"

# Validate with online tool
# Copy the JSON-LD output and paste into validator.schema.org
```

---

## Implementation Details

### How Schemas are Generated
1. **Utility Functions** (`src/lib/structured-data.ts`):
   - `createBlogPostingSchema()` - Generates BlogPosting schema from article data
   - `createPersonSchema()` - Generates Person schema for author
   - `createWebSiteSchema()` - Generates WebSite schema with search action
   - `createBreadcrumbSchema()` - Generates BreadcrumbList from navigation array

2. **Page Components** (e.g., `src/pages/BlogPost.tsx`):
   - Import schema utility functions
   - Build schema objects with page-specific data
   - Pass schemas to `<Seo>` component via `jsonLd` prop

3. **SEO Component** (`src/components/Seo.tsx`):
   - Accepts `jsonLd` prop (single object or array)
   - Stores schemas in HeadManager
   - Injects to DOM on client side
   - Renders to HTML on server side

4. **SSR Rendering** (`src/entry-server.tsx`):
   - Extracts schemas from HeadManager
   - Generates `<script type="application/ld+json">` tags
   - Injects into HTML `<head>` during prerendering

### Multiple Schemas Per Page
Pages can include multiple schemas by passing an array:

```typescript
const schemas = [personSchema, webSiteSchema];

<Seo 
  title="Mark Hazleton"
  description="..."
  jsonLd={schemas}
/>
```

This generates multiple `<script>` tags in the HTML:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  ...
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  ...
}
</script>
```

---

## Common Schema Patterns

### Using Real Data
All schemas are generated from real content data:
- Blog posts: From `src/data/articles.json`
- Projects: From `src/data/projects.json`
- Author info: From `src/lib/site.ts` constants

### Date Formatting
Dates should be in ISO 8601 format:
- `2025-07-12` - Just date
- `2025-07-12T10:30:00Z` - Date and time with timezone

### Duration Format
Reading time uses ISO 8601 duration format:
- `PT5M` - 5 minutes
- `PT1H30M` - 1 hour 30 minutes
- `PT45S` - 45 seconds

### URL Best Practices
- Always use absolute URLs: `https://markhazleton.com/blog/...`
- Ensure URLs match canonical URLs
- Use HTTPS protocol
- No trailing slashes on page URLs
- Consistent domain (no www. mismatch)

---

## Future Schema Enhancements

### FAQ Schema
For articles with Q&A sections:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is cloud architecture?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Cloud architecture is..."
      }
    }
  ]
}
```

### HowTo Schema
For tutorial articles:
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Deploy to Azure",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Step 1",
      "text": "Create Azure account"
    }
  ]
}
```

### VideoObject Schema
For pages with embedded videos:
```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Azure Tutorial",
  "description": "Learn how to...",
  "thumbnailUrl": "https://...",
  "uploadDate": "2025-01-18",
  "embedUrl": "https://www.youtube.com/embed/..."
}
```

---

## Troubleshooting

### Schema Not Detected
1. View page source and verify `<script type="application/ld+json">` exists in `<head>`
2. Copy JSON-LD and validate at validator.schema.org
3. Check for JSON syntax errors (missing quotes, commas, etc.)
4. Ensure URLs are absolute (not relative)
5. Wait 24-48 hours after deployment for Google to recrawl

### Invalid Schema Errors
1. Check property types match schema.org specification
2. Verify required properties are present
3. Use string values where expected (not objects)
4. Ensure dates are in ISO 8601 format
5. Validate with Google Rich Results Test

### Rich Results Not Showing
1. Verify schema is valid (no errors in Search Console)
2. Allow 2-4 weeks for rich results to appear
3. Check that page meets Google's quality guidelines
4. Ensure page is indexed (use "site:" search)
5. Not all pages with valid schema will show rich results

---

## Resources

- **Schema.org Documentation**: https://schema.org/
- **Google Structured Data Guide**: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- **Schema Markup Generator**: https://technicalseo.com/tools/schema-markup-generator/
- **JSON-LD Playground**: https://json-ld.org/playground/
- **Google Search Central**: https://developers.google.com/search

---

Last Updated: January 18, 2026
