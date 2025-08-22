import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";

import { MemoryUsersRepository } from "@/repositories/memory/memory-users-repository.ts";
import type { User } from "@/repositories/users-repository.ts";
import { UserFactory } from "@/tests/factories/create-user-raw-factory.ts";
import { AuthenticateService } from "../authenticate-service.ts";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error.ts";

let usersRepository: MemoryUsersRepository;
let user: User;
let authenticate: AuthenticateService;

describe("Authenticate test service", () => {
    beforeEach(async () => {
        usersRepository = new MemoryUsersRepository();

        const { user: returning } = await new UserFactory(usersRepository).create();

        user = returning;

        authenticate = new AuthenticateService(usersRepository);
    });

    it("should be able to authenticate", async () => {
        const { user: authenticatedUser } = await authenticate.execute({
            email: "john.doe@example.com",
            password: "123456",
        });

        expect(authenticatedUser.id).toBe(user.id);
    });
    it("should not be able to authenticate with wrong email", async () => {
        await expect(
            authenticate.execute({
                email: "john.do@example.com",
                password: "123456",
            }),
        ).rejects.toThrow(InvalidCredentialsError);
    });
    it("should not be able to authenticate with wrong password", async () => {
        await expect(
            authenticate.execute({
                email: "john.doe@example.com",
                password: "123123",
            }),
        ).rejects.toThrow(InvalidCredentialsError);
    });
});
