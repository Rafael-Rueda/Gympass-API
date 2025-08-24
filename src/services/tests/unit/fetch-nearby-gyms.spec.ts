import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MemoryGymsRepository } from "@/repositories/memory/memory-gyms-repository.ts";
import { MemoryUsersRepository } from "@/repositories/memory/memory-users-repository.ts";
import type { User } from "@/repositories/users-repository.ts";
import { FetchNearbyGymsService } from "@/services/fetch-nearby-gyms.ts";
import { GymFactory } from "@/tests/factories/create-gym-raw-factory.ts";
import { UserFactory } from "@/tests/factories/create-user-raw-factory.ts";

let user: User;
let gymsRepository: MemoryGymsRepository;

describe("Check-in history test services", () => {
    beforeEach(async () => {
        const usersRepository = new MemoryUsersRepository();
        gymsRepository = new MemoryGymsRepository();

        const createUser = new UserFactory(usersRepository);
        const { user: returningUser } = await createUser.create();

        user = returningUser;

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to fetch nearby gyms", async () => {
        for (let i = 1; i < 23; i++) {
            vi.setSystemTime(new Date(2025, 0, i, 8, 0, 0));
            if (i !== 2) {
                await new GymFactory(gymsRepository).create(
                    `Gym ${i}`,
                    `Test description ${i}`,
                    "1234567890",
                    Math.random(),
                    Math.random(),
                );
            } else {
                await new GymFactory(gymsRepository).create(`Gym ${i}`, `Test description ${i}`, "1234567890", 0, 0);
            }
        }

        const { gyms } = await new FetchNearbyGymsService(gymsRepository).execute({
            userLatitude: 0.0011158,
            userLongitude: 0.0011158,
            page: 1,
        });

        expect(gyms).toEqual(expect.arrayContaining([expect.objectContaining({ id: expect.any(String) })]));
    });

    it("should not be able to fetch farby gyms", async () => {
        for (let i = 1; i < 23; i++) {
            vi.setSystemTime(new Date(2025, 0, i, 8, 0, 0));
            if (i !== 2) {
                await new GymFactory(gymsRepository).create(
                    `Gym ${i}`,
                    `Test description ${i}`,
                    "1234567890",
                    Math.random(),
                    Math.random(),
                );
            } else {
                await new GymFactory(gymsRepository).create(`Gym ${i}`, `Test description ${i}`, "1234567890", 0, 0);
            }
        }

        const { gyms } = await new FetchNearbyGymsService(gymsRepository).execute({
            userLatitude: 34.32432,
            userLongitude: 54.35435,
            page: 1,
        });

        expect(gyms).toEqual(expect.arrayContaining([]));
    });
});
