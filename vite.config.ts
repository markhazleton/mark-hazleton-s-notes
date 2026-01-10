import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig(({ mode, ssrBuild }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    mode === "production" && viteCompression({
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
        rollupOptions: {
          output: {
            entryFileNames: "assets/site.js",
            chunkFileNames: "assets/site.js",
            assetFileNames: (assetInfo) => {
              if (assetInfo.name?.endsWith(".css")) {
                return "assets/site.css";
              }
              return "assets/[name].[ext]";
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
}));
