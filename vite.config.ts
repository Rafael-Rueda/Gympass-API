import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        environment: "node",
        env: {
            NODE_ENV: "test",
        },
        coverage: {
            exclude: [
                "**/node_modules/**",
                "**/generated/**",
                "**/coverage/**",
                "**/*.d.ts",
                "**/prisma/**",
                "**/dist/**",
                "**/src/env/**",
                "**/src/app.ts",
                "**/src/server.ts",
                "**/*.config.ts",
            ],
        },
    },
});
