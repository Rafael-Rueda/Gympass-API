import { compare } from "bcryptjs";
import { describe, expect, it } from "vitest";

import { MemoryUsersRepository } from "@/repositories/memory/memory-users-repository.ts";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error.ts";
import { UserFactory } from "@/tests/factories/create-user-factory.ts";

describe("Create user test services", () => {
    it("should hash user password upon registration", async () => {
        const createUser = new UserFactory(new MemoryUsersRepository());

        const { user } = await createUser.create();

        expect(user.passwordHash).not.toEqual("123456");
        expect(user.passwordHash).toHaveLength(60);
        expect(await compare("123456", user.passwordHash)).toBe(true);
    });

    it("should not be able to create a new user with same email twice", async () => {
        const createUser = new UserFactory(new MemoryUsersRepository());

        await createUser.create();

        await expect(createUser.create()).rejects.toThrow(UserAlreadyExistsError);
    });
});
