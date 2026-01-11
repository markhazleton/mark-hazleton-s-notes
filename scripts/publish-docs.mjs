import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const docsDir = path.join(rootDir, "docs");

const ensureDist = async () => {
  try {
    const stats = await fs.stat(distDir);
    if (!stats.isDirectory()) {
      throw new Error("dist is not a directory");
    }
  } catch (error) {
    throw new Error("dist output not found. Run the build first.");
  }
};

await ensureDist();
await fs.rm(docsDir, { recursive: true, force: true });
await fs.cp(distDir, docsDir, { recursive: true });

console.log("Published site to /docs.");
