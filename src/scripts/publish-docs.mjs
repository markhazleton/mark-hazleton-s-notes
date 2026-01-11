import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const docsDir = path.join(rootDir, "docs");
const staticSourceDir = path.join(rootDir, "src", "static");

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

await ensureDocs();
await copyIfExists(staticSourceDir, docsDir);

console.log("Synced static assets into /docs.");
