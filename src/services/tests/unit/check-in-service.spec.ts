import { compare } from "bcryptjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Gym } from "@/repositories/gyms-repository.ts";
import { MemoryCheckInsRepository } from "@/repositories/memory/memory-check-ins-repository.ts";
import { MemoryGymsRepository } from "@/repositories/memory/memory-gyms-repository.ts";
import { MemoryUsersRepository } from "@/repositories/memory/memory-users-repository.ts";
import type { User } from "@/repositories/users-repository.ts";
import { CheckInService } from "@/services/check-in-service.ts";
import { UserAlreadyCheckInError } from "@/services/errors/user-already-check-in-error.ts";
import { GymFactory } from "@/tests/factories/create-gym-raw-factory.ts";
import { UserFactory } from "@/tests/factories/create-user-raw-factory.ts";

let createCheckIn: CheckInService;
let user: User;
let gym: Gym;
let gymsRepository: MemoryGymsRepository;

describe("Check-in test services", () => {
    beforeEach(async () => {
        const usersRepository = new MemoryUsersRepository();
        const checkInsRepository = new MemoryCheckInsRepository();
        gymsRepository = new MemoryGymsRepository();

        const createUser = new UserFactory(usersRepository);
        const { user: returningUser } = await createUser.create();

        user = returningUser;

        const createGym = new GymFactory(gymsRepository);
        const { gym: returningGym } = await createGym.create();

        gym = returningGym;

        createCheckIn = new CheckInService(checkInsRepository, gymsRepository);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to check in", async () => {
        vi.setSystemTime(new Date(2025, 0, 1, 8, 0, 0));

        const { checkIn } = await createCheckIn.execute({
            userId: user.id,
            gymId: gym.id,
            userLatitude: 0,
            userLongitude: 0,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it("should not be able to check in twice in the same day", async () => {
        vi.setSystemTime(new Date(2025, 0, 1, 8, 0, 0));

        const { checkIn } = await createCheckIn.execute({
            userId: user.id,
            gymId: gym.id,
            userLatitude: 0,
            userLongitude: 0,
        });

        expect(checkIn.id).toEqual(expect.any(String));

        await expect(
            createCheckIn.execute({ userId: user.id, gymId: gym.id, userLatitude: 0, userLongitude: 0 }),
        ).rejects.toThrow(UserAlreadyCheckInError);
    });

    it("should be able to check in but in different days", async () => {
        vi.setSystemTime(new Date(2025, 0, 1, 8, 0, 0));

        const { checkIn } = await createCheckIn.execute({
            userId: user.id,
            gymId: gym.id,
            userLatitude: 0,
            userLongitude: 0,
        });

        expect(checkIn.id).toEqual(expect.any(String));

        vi.setSystemTime(new Date(2025, 0, 2, 8, 0, 0));

        await expect(
            createCheckIn.execute({ userId: user.id, gymId: gym.id, userLatitude: 0, userLongitude: 0 }),
        ).resolves.toBeTruthy();
    });

    it("should not be able to check in if the user is distant from gym", async () => {
        vi.setSystemTime(new Date(2025, 0, 1, 8, 0, 0));

        const createGym = new GymFactory(gymsRepository);

        const { gym: returningGym } = await createGym.create(undefined, undefined, undefined, 100320, 103942);

        await expect(
            createCheckIn.execute({ userId: user.id, gymId: returningGym.id, userLatitude: 0, userLongitude: 0 }),
        ).rejects.toThrow(Error);
    });
});
