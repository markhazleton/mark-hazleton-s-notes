import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");

const readJson = async (relativePath) => {
  const absolutePath = path.join(rootDir, relativePath);
  const content = await fs.readFile(absolutePath, "utf-8");
  return JSON.parse(content);
};

const buildSlug = (entry) => {
  if (entry.contentFile) {
    return entry.contentFile.replace(/\.md$/i, "");
  }
  return entry.slug.replace(/^articles\//, "").replace(/\.html$/i, "");
};

const getRepositoryData = async () => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/markhazleton/github-stats-spark/refs/heads/main/data/repositories.json",
    );
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    return null;
  }
};

const articles = await readJson("src/data/articles.json");
const projects = await readJson("src/data/projects.json");
const posts = articles.filter((entry) => entry.contentFile && entry.contentFile !== "articles.md");

const staticRoutes = ["/", "/blog", "/about", "/projects", "/contact", "/now"];
const blogRoutes = posts.map((entry) => `/blog/${buildSlug(entry)}`);
const projectRoutes = projects.map((project) => `/projects/${project.slug}`);
const repositoryPayload = await getRepositoryData();
const repositoryRoutes = Array.isArray(repositoryPayload?.repositories)
  ? repositoryPayload.repositories.map((repo) => `/now/repositories/${encodeURIComponent(repo.name)}`)
  : [];

const routes = Array.from(
  new Set([...staticRoutes, ...blogRoutes, ...projectRoutes, ...repositoryRoutes]),
);

const template = await fs.readFile(path.join(distDir, "index.html"), "utf-8");
const stateScript = repositoryPayload
  ? `<script>window.__REPOSITORY_STATS__ = ${JSON.stringify(repositoryPayload).replace(
      /</g,
      "\\u003c",
    )};</script>`
  : "";
const resolveEntryServerPath = async () => {
  const candidates = [
    path.join(distDir, "server", "entry-server.js"),
    path.join(distDir, "server", "assets", "site.js"),
  ];

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch (error) {
      // Try next candidate.
    }
  }

  const assetsDir = path.join(distDir, "server", "assets");
  try {
    const files = await fs.readdir(assetsDir);
    const jsFiles = files.filter((file) => file.endsWith(".js"));
    for (const file of jsFiles) {
      const fullPath = path.join(assetsDir, file);
      const content = await fs.readFile(fullPath, "utf-8");
      if (/export\{[^}]*\brender\b/.test(content)) {
        return fullPath;
      }
    }
  } catch (error) {
    // Fall through to error below if assets are missing.
  }

  throw new Error("Unable to locate SSR entry module in dist/server.");
};

const entryServerPath = pathToFileURL(await resolveEntryServerPath()).href;
const { render } = await import(entryServerPath);

await Promise.all(
  routes.map(async (route) => {
    if (repositoryPayload) {
      globalThis.__REPOSITORY_STATS__ = repositoryPayload;
    }
    const { html, head } = render(route);
    const page = template
      .replace("<!--app-head-->", head ?? "")
      .replace("<!--app-state-->", stateScript)
      .replace("<!--app-html-->", html ?? "");
    const filePath =
      route === "/"
        ? path.join(distDir, "index.html")
        : path.join(distDir, route, "index.html");
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, page, "utf-8");
  }),
);

console.log(`Prerendered ${routes.length} routes.`);
