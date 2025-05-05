import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // Enable global test APIs (describe, it, expect, etc.)
    environment: "jsdom", // Use JSDOM environment for DOM manipulation
  },
});
