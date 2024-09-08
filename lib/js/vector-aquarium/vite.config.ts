import dts from "vite-plugin-dts";
import path from "path";
import { defineConfig, UserConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [dts({ rollupTypes: true }),],
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: "VectorAquarium",
      formats: ["es", "umd"],
      fileName: (format) => `index.${format}.js`,
    },
  },
} satisfies UserConfig);