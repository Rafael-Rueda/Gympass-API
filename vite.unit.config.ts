import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        name: "unit",
        include: ["src/**/!(*e2e*)/*.{test,spec}.{js,ts}", "tests/unit/**/*.{test,spec}.{js,ts}"],
        sequence: { concurrent: true },
    },
});
