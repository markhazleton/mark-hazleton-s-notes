import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const docsDir = path.join(rootDir, "docs");
const staticSourceDir = path.join(rootDir, "src", "static");
const dataSourceDir = path.join(rootDir, "src", "data");

const ensureDocs = async () => {
  try {
    const stats = await fs.stat(docsDir);
    if (!stats.isDirectory()) {
      throw new Error("docs is not a directory");
    }
  } catch (error) {
    throw new Error("docs output not found. Run the build first.");
  }
};

const copyIfExists = async (sourceDir, targetDir) => {
  try {
    const stats = await fs.stat(sourceDir);
    if (!stats.isDirectory()) {
      return;
    }
  } catch (error) {
    return;
  }

  await fs.mkdir(path.dirname(targetDir), { recursive: true });
  await fs.cp(sourceDir, targetDir, { recursive: true });
};

const copyFileIfExists = async (sourcePath, targetPath) => {
  try {
    await fs.stat(sourcePath);
    await fs.copyFile(sourcePath, targetPath);
    return true;
  } catch (error) {
    return false;
  }
};

await ensureDocs();
await copyIfExists(staticSourceDir, docsDir);

// Copy data JSON files to root for public access
const dataFiles = ["articles.json", "projects.json"];
for (const file of dataFiles) {
  const copied = await copyFileIfExists(
    path.join(dataSourceDir, file),
    path.join(docsDir, file)
  );
  if (copied) {
    console.log(`Copied ${file} to /docs root`);
  }
}

// Copy repositories.json from docs/data to root if it exists
const reposCopied = await copyFileIfExists(
  path.join(docsDir, "data", "repositories.json"),
  path.join(docsDir, "repositories.json")
);
if (reposCopied) {
  console.log("Copied repositories.json to /docs root");
}

console.log("Synced static assets into /docs.");
