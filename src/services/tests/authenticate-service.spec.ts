import { hash } from "bcryptjs";
import { describe, expect, it } from "vitest";

import { MemoryUsersRepository } from "@/repositories/memory/memory-users-repository.ts";
import { UserFactory } from "@/tests/factories/create-user-factory.ts";
import { AuthenticateService } from "../authenticate.ts";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error.ts";

describe("Authenticate test service", () => {
    it("should be able to authenticate", async () => {
        const usersRepository = new MemoryUsersRepository();

        const user = await usersRepository.create({
            name: "John Doe",
            email: "john.doe@example.com",
            passwordHash: await hash("123456", 6),
        });

        const authenticate = new AuthenticateService(usersRepository);

        const { user: authenticatedUser } = await authenticate.execute({
            email: "john.doe@example.com",
            password: "123456",
        });

        expect(authenticatedUser.id).toBe(user.id);
    });
    it("should not be able to authenticate with wrong email", async () => {
        const usersRepository = new MemoryUsersRepository();

        const user = await usersRepository.create({
            name: "John Doe",
            email: "john.doe@example.com",
            passwordHash: await hash("123456", 6),
        });

        const authenticate = new AuthenticateService(usersRepository);

        await expect(
            authenticate.execute({
                email: "john.do@example.com",
                password: "123456",
            }),
        ).rejects.toThrow(InvalidCredentialsError);
    });
    it("should not be able to authenticate with wrong password", async () => {
        const usersRepository = new MemoryUsersRepository();

        const user = await usersRepository.create({
            name: "John Doe",
            email: "john.doe@example.com",
            passwordHash: await hash("123456", 6),
        });

        const authenticate = new AuthenticateService(usersRepository);

        await expect(
            authenticate.execute({
                email: "john.doe@example.com",
                password: "123123",
            }),
        ).rejects.toThrow(InvalidCredentialsError);
    });
});
