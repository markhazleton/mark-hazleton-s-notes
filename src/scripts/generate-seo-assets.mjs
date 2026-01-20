import fs from "node:fs/promises";
import path from "node:path";

const rawSiteUrl =
  process.env.SITE_URL ?? process.env.VITE_SITE_URL ?? "https://markhazleton.com";
const siteUrl = rawSiteUrl.replace(/\/$/, "");
const rootDir = process.cwd();
const outputDir = path.join(rootDir, "docs");

const readJson = async (relativePath) => {
  const absolutePath = path.join(rootDir, relativePath);
  const content = await fs.readFile(absolutePath, "utf-8");
  return JSON.parse(content);
};

const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const normalizeDate = (value) => {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toISOString();
};

const stripMarkdown = (value = "") =>
  value
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^#+\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/[_~]/g, "")
    .replace(/\s+/g, " ")
    .replace(/^"+/, "")
    .replace(/"+$/, "")
    .trim();

const buildSlug = (entry) => {
  if (entry.contentFile) {
    return entry.contentFile.replace(/\.md$/i, "");
  }
  return entry.slug.replace(/^articles\//, "").replace(/\.html$/i, "");
};

const getLastModDate = (entry) => {
  // Use lastmod if available, otherwise use publishedDate
  const date = entry.lastmod || entry.publishedDate;
  if (!date) return new Date().toISOString().split('T')[0];
  
  try {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    return parsed.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
};

const getRepositoryRoutes = async () => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/markhazleton/github-stats-spark/refs/heads/main/data/repositories.json",
    );
    if (!response.ok) {
      return { routes: [], lastmod: null };
    }
    const payload = await response.json();
    const routes = Array.isArray(payload.repositories)
      ? payload.repositories.map((repo) => `/github/repositories/${encodeURIComponent(repo.name)}`)
      : [];
    const lastmod = normalizeDate(payload.metadata?.generated_at);
    return { routes, lastmod };
  } catch (error) {
    return { routes: [], lastmod: null };
  }
};

const articles = await readJson("src/data/articles.json");
const projects = await readJson("src/data/projects.json");

const posts = articles
  .filter((entry) => entry.contentFile && entry.contentFile !== "articles.md" && !entry.contentFile.startsWith("_"))
  .map((entry) => ({
    slug: buildSlug(entry),
    title: entry.name,
    description: stripMarkdown(entry.summary || entry.description || ""),
    date: normalizeDate(entry.publishedDate || entry.lastmod) ?? null,
  }))
  .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

const staticRoutes = ["/", "/blog", "/projects", "/contact", "/github", "/videos"];
const blogRoutes = posts.map((post) => `/blog/${post.slug}`);
const projectRoutes = projects.map((project) => `/projects/${project.slug}`);
const repositoryResult = await getRepositoryRoutes();
const repositoryRoutes = repositoryResult.routes;

const urlSet = new Map();
const addUrl = (loc, lastmod) => {
  urlSet.set(loc, lastmod);
};

const buildLoc = (route) => `${siteUrl}${route}`;
const buildLastmod = (value) => (value ? `<lastmod>${value}</lastmod>` : "");

const buildDate = normalizeDate(new Date());
staticRoutes.forEach((route) => addUrl(buildLoc(route), buildDate));
blogRoutes.forEach((route, index) => {
  const lastmod = getLastModDate(posts[index]);
  addUrl(buildLoc(route), lastmod);
});
projectRoutes.forEach((route, index) => {
  const lastmod = getLastModDate(projects[index]);
  addUrl(buildLoc(route), lastmod);
});
repositoryRoutes.forEach((route) => addUrl(buildLoc(route), repositoryResult.lastmod ?? buildDate));

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  `${Array.from(urlSet.entries())
    .map(([loc, lastmod]) => `  <url><loc>${loc}</loc>${buildLastmod(lastmod)}</url>`)
    .join("\n")}\n` +
  `</urlset>\n`;

const feedItems = posts
  .map((post) => {
    const link = `${siteUrl}/blog/${post.slug}`;
    const pubDate = post.date ? new Date(post.date).toUTCString() : new Date().toUTCString();
    const description = escapeXml(post.description);
    return `  <item>\n` +
      `    <title>${escapeXml(post.title)}</title>\n` +
      `    <link>${link}</link>\n` +
      `    <guid>${link}</guid>\n` +
      `    <pubDate>${pubDate}</pubDate>\n` +
      `    <description><![CDATA[${description}]]></description>\n` +
      `  </item>`;
  })
  .join("\n");

const feedXml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<rss version="2.0">\n` +
  `  <channel>\n` +
  `    <title>Mark Hazleton Blog</title>\n` +
  `    <link>${siteUrl}/blog</link>\n` +
  `    <description>Technical notes on cloud architecture, integration patterns, and engineering practices.</description>\n` +
  `    <language>en-us</language>\n` +
  `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n` +
  `${feedItems ? `${feedItems}\n` : ""}` +
  `  </channel>\n` +
  `</rss>\n`;

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(path.join(outputDir, "sitemap.xml"), sitemapXml, "utf-8");
await fs.writeFile(path.join(outputDir, "feed.xml"), feedXml, "utf-8");
const robotsTxt = [
  "User-agent: Googlebot",
  "Allow: /",
  "",
  "User-agent: Bingbot",
  "Allow: /",
  "",
  "User-agent: Twitterbot",
  "Allow: /",
  "",
  "User-agent: facebookexternalhit",
  "Allow: /",
  "",
  "User-agent: *",
  "Allow: /",
  "",
  `Sitemap: ${siteUrl}/sitemap.xml`,
  "",
].join("\n");
await fs.writeFile(path.join(outputDir, "robots.txt"), robotsTxt, "utf-8");

console.log("Generated sitemap.xml and feed.xml");
