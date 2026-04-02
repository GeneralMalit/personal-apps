import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const currentDirectory = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@timestamp-copy/core": resolve(currentDirectory, "../../packages/core/src/index.ts")
    }
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        options: resolve(currentDirectory, "options.html"),
        offscreen: resolve(currentDirectory, "offscreen.html"),
        background: resolve(currentDirectory, "src/background.ts")
      },
      output: {
        entryFileNames: (chunkInfo) =>
          chunkInfo.name === "background" ? "background.js" : "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]"
      }
    }
  }
});
