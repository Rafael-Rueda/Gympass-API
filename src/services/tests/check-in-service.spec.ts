import { compare } from "bcryptjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MemoryCheckInsRepository } from "@/repositories/memory/memory-check-ins-repository.ts";
import { MemoryUsersRepository } from "@/repositories/memory/memory-users-repository.ts";
import type { User } from "@/repositories/users-repository.ts";
import { UserFactory } from "@/tests/factories/create-user-service-factory.ts";
import { CheckInService } from "../check-in-service.ts";

let createCheckIn: CheckInService;
let user: User;

describe("Check-in test services", () => {
    beforeEach(async () => {
        const usersRepository = new MemoryUsersRepository();
        const checkInsRepository = new MemoryCheckInsRepository();

        const createUser = new UserFactory(usersRepository);
        const { user: returningUser } = await createUser.create();

        user = returningUser;
        createCheckIn = new CheckInService(checkInsRepository);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to check in", async () => {
        vi.setSystemTime(new Date(2025, 0, 1, 8, 0, 0));

        const { checkIn } = await createCheckIn.execute({ userId: user.id, gymId: "123" });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it("should not be able to check in twice in the same day", async () => {
        vi.setSystemTime(new Date(2025, 0, 1, 8, 0, 0));

        const { checkIn } = await createCheckIn.execute({ userId: user.id, gymId: "123" });

        expect(checkIn.id).toEqual(expect.any(String));

        await expect(createCheckIn.execute({ userId: user.id, gymId: "123" })).rejects.toThrow(Error);
    });

    it("should be able to check in but in different days", async () => {
        vi.setSystemTime(new Date(2025, 0, 1, 8, 0, 0));

        const { checkIn } = await createCheckIn.execute({ userId: user.id, gymId: "123" });

        expect(checkIn.id).toEqual(expect.any(String));

        vi.setSystemTime(new Date(2025, 0, 2, 8, 0, 0));

        await expect(createCheckIn.execute({ userId: user.id, gymId: "123" })).resolves.toBeTruthy();
    });

    it("should not be able to check in but in different hours in the same day", async () => {
        vi.setSystemTime(new Date(2025, 0, 1, 8, 0, 0));

        const { checkIn } = await createCheckIn.execute({ userId: user.id, gymId: "123" });

        expect(checkIn.id).toEqual(expect.any(String));

        vi.setSystemTime(new Date(2025, 0, 1, 14, 0, 0));

        await expect(createCheckIn.execute({ userId: user.id, gymId: "123" })).rejects.toThrow(Error);
    });
});
