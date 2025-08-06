import path from "node:path";

import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { livestoreDevtoolsPlugin } from "@livestore/devtools-vite";

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    // TODO remove once fixed https://github.com/vitejs/vite/issues/8427
    exclude: ["@livestore/wa-sqlite"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    livestoreDevtoolsPlugin({
      schemaPath: "./src/lib/livestore/schema/index.ts",
    }),
  ],
});
