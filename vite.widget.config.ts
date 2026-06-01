import { defineConfig } from "vite";

/**
 * Builds the anywidget front-end as a single, self-contained ESM file
 * (everything inlined) so it can be loaded via `_esm` in Python.
 */
export default defineConfig({
  build: {
    outDir: "src_widget/gesture_widget/static",
    emptyOutDir: false,
    sourcemap: false,
    lib: {
      entry: "src/widget.ts",
      formats: ["es"],
      fileName: () => "widget.js",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
