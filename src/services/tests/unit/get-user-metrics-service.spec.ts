import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Gym } from "@/repositories/gyms-repository.ts";
import { MemoryCheckInsRepository } from "@/repositories/memory/memory-check-ins-repository.ts";
import { MemoryGymsRepository } from "@/repositories/memory/memory-gyms-repository.ts";
import { MemoryUsersRepository } from "@/repositories/memory/memory-users-repository.ts";
import type { User } from "@/repositories/users-repository.ts";
import { CheckInService } from "@/services/check-in-service.ts";
import { GetUserMetricsService } from "@/services/get-user-metrics-service.ts";
import { GymFactory } from "@/tests/factories/create-gym-raw-factory.ts";
import { UserFactory } from "@/tests/factories/create-user-raw-factory.ts";

let createCheckIn: CheckInService;
let user: User;
let gym: Gym;
let gymsRepository: MemoryGymsRepository;
let checkInsRepository: MemoryCheckInsRepository;

describe("User metrics test services", () => {
    beforeEach(async () => {
        const usersRepository = new MemoryUsersRepository();
        checkInsRepository = new MemoryCheckInsRepository();
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

    it("should be able to get the user metrics for check ins (check ins count)", async () => {
        for (let i = 1; i < 23; i++) {
            vi.setSystemTime(new Date(2025, 0, i, 8, 0, 0));

            await createCheckIn.execute({
                userId: user.id,
                gymId: gym.id,
                userLatitude: 0,
                userLongitude: 0,
            });
        }

        const { checkInsCount } = await new GetUserMetricsService(checkInsRepository).execute({
            userId: user.id,
        });

        expect(checkInsCount).toEqual(22);
    });
});
