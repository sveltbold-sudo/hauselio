import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts", "__tests__/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["lib/**/*.ts", "app/api/**/*.ts", "middleware.ts"],
      exclude: ["node_modules/", "tests/"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname),
    },
  },
});
