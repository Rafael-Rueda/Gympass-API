import { execSync } from "node:child_process";
import request from "supertest";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "@/app.ts";
import { env } from "@/env/index.ts";
import { prisma } from "@/lib/prisma.ts";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository.ts";
import { UserFactory } from "@/tests/factories/create-user-raw-factory.ts";

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

        await new UserFactory(new PrismaUsersRepository()).create();
    });

    afterAll(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE "users" CASCADE`;
        await prisma.$disconnect();
        await app.close();
    });

    it("should be able to authenticate a user that match with the credentials", async () => {
        const response = await request(app.server).post("/sessions").send({
            email: "john.doe@example.com",
            password: "123456",
        });

        expect(response.status).toBe(200);
    });

    it("should not be able to authenticate a user that does not match with the credentials", async () => {
        const response = await request(app.server).post("/sessions").send({
            email: "john.doe@example.com",
            password: "wrongpassword",
        });
        expect(response.status).toBe(401);
    });
});
