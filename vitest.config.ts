import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["packages/**/*.test.ts", "apps/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["packages/core/src/**/*.ts"],
      exclude: ["**/*.d.ts", "**/dist/**", "**/*.config.*"],
      thresholds: {
        lines: 80,
        branches: 80,
        statements: 80
      }
    }
  }
});
