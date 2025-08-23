import { execSync } from "node:child_process";
import request from "supertest";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "@/app.ts";
import { env } from "@/env/index.ts";
import { prisma } from "@/lib/prisma.ts";

describe("Create user test routes", () => {
    beforeAll(async () => {
        if (env.NODE_ENV !== "test") {
            throw new Error("Tests must run in test environment");
        }

        try {
            execSync("npx prisma migrate deploy", {
                stdio: "pipe",
                env: { DATABASE_URL: env.DATABASE_URL },
            });
            await app.ready();
        } catch (error) {
            console.error("Migration failed:", error);
            throw error;
        }
    });

    afterAll(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE "users" CASCADE`;
        await prisma.$disconnect();
        await app.close();
    });

    it("should be able to create a new user", async () => {
        const response = await request(app.server).post("/users").send({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "123456",
        });

        expect(response.status).toBe(201);
    });

    it("should not be able to access a resource that does not exist", async () => {
        const response = await request(app.server).get("/users/123");
        expect(response.status).toBe(404);
    });
});
