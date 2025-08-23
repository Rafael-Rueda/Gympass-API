import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        name: "e2e",
        include: ["src/**/tests/e2e/**/*.{test,spec}.{js,ts}"],
        fileParallelism: false,
    },
});
