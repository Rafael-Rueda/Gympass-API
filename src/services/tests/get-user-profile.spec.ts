import { beforeEach, describe, expect, it } from "vitest";

import { MemoryUsersRepository } from "@/repositories/memory/memory-users-repository.ts";
import type { User } from "@/repositories/users-repository.ts";
import { UserFactory } from "@/tests/factories/create-user-raw-factory.ts";
import { ResourceNotFoundError } from "../errors/resource-not-found-error.ts";
import { GetUserProfileService } from "../get-user-profile-service.ts";

let usersRepository: MemoryUsersRepository;
let user: User;
let sut: GetUserProfileService;

describe("Get user profile test services", () => {
    beforeEach(async () => {
        usersRepository = new MemoryUsersRepository();
        sut = new GetUserProfileService(usersRepository);

        const { user: returning } = await new UserFactory(usersRepository).create();

        user = returning;
    });

    it("should be able to get a user profile when it exists", async () => {
        const { user: sutResult } = await sut.execute({ userId: user.id });

        expect(sutResult.id).toEqual(expect.any(String));
        expect(sutResult.name).toBe("John Doe");
    });

    it("should not be able to get a user profile when wrong id is informed", async () => {
        await expect(sut.execute({ userId: "non-existing" })).rejects.toThrow(ResourceNotFoundError);
    });
});
