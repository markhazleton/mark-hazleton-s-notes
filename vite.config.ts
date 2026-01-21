import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
const normalizeBase = (value?: string) => {
  if (!value) {
    return "/";
  }

  let base = value.trim();
  if (!base.startsWith("/")) {
    base = `/${base}`;
  }
  if (!base.endsWith("/")) {
    base = `${base}/`;
  }
  return base;
};

export default defineConfig(({ mode, ssrBuild }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = normalizeBase(env.VITE_BASE_PATH);

  return {
    base,
    publicDir: path.resolve(__dirname, "src/static"),
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      mode === "production" &&
        viteCompression({
          algorithm: "gzip",
          ext: ".gz",
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: ssrBuild
      ? {}
      : {
          outDir: "docs",
          // Note: emptyOutDir handled by npm run clean (rimraf docs)
          rollupOptions: {
            output: {
              // Use content hash for cache busting (industry standard)
              // Format: site-[hash].js - hash changes only when content changes
              entryFileNames: "assets/site-[hash].js",
              chunkFileNames: "assets/chunk-[hash].js",
              assetFileNames: (assetInfo) => {
                if (assetInfo.name?.endsWith(".css")) {
                  return "assets/site-[hash].css";
                }
                return "assets/[name]-[hash].[ext]";
              },
            },
          },
          cssCodeSplit: false,
          minify: "terser",
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          },
          sourcemap: false,
        },
  };
});
