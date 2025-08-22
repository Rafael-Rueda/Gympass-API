import { execSync } from "node:child_process";
import request from "supertest";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "@/app.ts";
import { prisma } from "@/lib/prisma.ts";

describe.skip("Create user test routes", () => {
    beforeAll(async () => {
        try {
            execSync("npx prisma migrate dev");
        } catch {
            await prisma.user.deleteMany();
        }

        await app.ready();
    });

    beforeEach(async () => {
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await prisma.user.deleteMany();
    });

    afterEach(async () => {
        await prisma.user.deleteMany();
    });

    it("should be able to create a new user", async () => {
        await prisma.user.deleteMany();

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
