import { execSync } from "node:child_process";
import request from "supertest";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "@/app.ts";
import { prisma } from "@/lib/prisma.ts";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository.ts";
import { UserFactory } from "@/tests/factories/create-user-raw-factory.ts";

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

    it("should be able to authenticate a user that match with the credentials", async () => {
        await new UserFactory(new PrismaUsersRepository()).create();

        const response = await request(app.server).post("/sessions").send({
            email: "john.doe@example.com",
            password: "123456",
        });

        expect(response.status).toBe(200);
    });

    it("should not be able to authenticate a user that does not match with the credentials", async () => {
        await new UserFactory(new PrismaUsersRepository()).create();

        const response = await request(app.server).post("/sessions").send({
            email: "john.doe@example.com",
            password: "wrongpassword",
        });
        expect(response.status).toBe(401);
    });
});
