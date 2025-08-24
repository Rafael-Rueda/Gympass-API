import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Gym } from "@/repositories/gyms-repository.ts";
import { MemoryCheckInsRepository } from "@/repositories/memory/memory-check-ins-repository.ts";
import { MemoryGymsRepository } from "@/repositories/memory/memory-gyms-repository.ts";
import { MemoryUsersRepository } from "@/repositories/memory/memory-users-repository.ts";
import type { User } from "@/repositories/users-repository.ts";
import { CheckInService } from "@/services/check-in-service.ts";
import { FetchUserCheckInsService } from "@/services/fetch-user-check-ins-history.ts";
import { GymFactory } from "@/tests/factories/create-gym-raw-factory.ts";
import { UserFactory } from "@/tests/factories/create-user-raw-factory.ts";

let createCheckIn: CheckInService;
let user: User;
let gym: Gym;
let gymsRepository: MemoryGymsRepository;
let checkInsRepository: MemoryCheckInsRepository;

describe("Check-in history test services", () => {
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

    it("should be able to fetch the history of 2 check ins", async () => {
        vi.setSystemTime(new Date(2025, 0, 1, 8, 0, 0));

        const { checkIn } = await createCheckIn.execute({
            userId: user.id,
            gymId: gym.id,
            userLatitude: 0,
            userLongitude: 0,
        });

        vi.setSystemTime(new Date(2025, 0, 2, 8, 0, 0));

        const { checkIn: checkIn2 } = await createCheckIn.execute({
            userId: user.id,
            gymId: gym.id,
            userLatitude: 0,
            userLongitude: 0,
        });

        expect(checkIn.id).toEqual(expect.any(String));

        const { checkIns } = await new FetchUserCheckInsService(checkInsRepository).execute({
            userId: user.id,
            page: 1,
        });

        expect(checkIns).toEqual(expect.any(Array));

        expect(checkIns).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    createdAt: expect.any(Date),
                    gymId: expect.any(String),
                    updatedAt: expect.any(Date),
                    userId: expect.any(String),
                    validatedAt: expect.toSatisfy((value: null | Date) => value === null || value instanceof Date),
                }),
            ]),
        );

        expect(checkIns).toHaveLength(2);
    });

    it("should be able to fetch the paginated history of many check ins", async () => {
        for (let i = 1; i < 23; i++) {
            vi.setSystemTime(new Date(2025, 0, i, 8, 0, 0));

            await createCheckIn.execute({
                userId: user.id,
                gymId: gym.id,
                userLatitude: 0,
                userLongitude: 0,
            });
        }

        const { checkIns } = await new FetchUserCheckInsService(checkInsRepository).execute({
            userId: user.id,
            page: 2,
        });

        expect(checkIns).toEqual([
            expect.objectContaining({ id: expect.any(String) }),
            expect.objectContaining({ id: expect.any(String) }),
        ]);
    });
});
