import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const docsDir = path.join(rootDir, "docs");
const imageSourceDir = path.join(rootDir, "src", "data", "img");
const imageTargetDir = path.join("src", "data", "img");

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
await fs.cp(imageSourceDir, path.join(distDir, imageTargetDir), { recursive: true });
await fs.cp(imageSourceDir, path.join(docsDir, imageTargetDir), { recursive: true });

console.log("Published site to /docs.");
