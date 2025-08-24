import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MemoryGymsRepository } from "@/repositories/memory/memory-gyms-repository.ts";
import { MemoryUsersRepository } from "@/repositories/memory/memory-users-repository.ts";
import type { User } from "@/repositories/users-repository.ts";
import { SearchGymsService } from "@/services/search-gyms-service.ts";
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

    it("should be able to search for gyms by name and description", async () => {
        for (let i = 1; i < 23; i++) {
            vi.setSystemTime(new Date(2025, 0, i, 8, 0, 0));
            await new GymFactory(gymsRepository).create(`Gym ${i}`, `Test description ${i}`, "1234567890", 0, 0);
        }

        const { gyms: gymsQ1 } = await new SearchGymsService(gymsRepository).execute({
            query: "Gym",
            page: 1,
        });

        expect(gymsQ1).toHaveLength(20);

        const { gyms: gymsQ2 } = await new SearchGymsService(gymsRepository).execute({
            query: "Gym 21",
            page: 1,
        });

        expect(gymsQ2).toHaveLength(1);

        const { gyms: gymsQ3 } = await new SearchGymsService(gymsRepository).execute({
            query: "Test description 21",
            page: 1,
        });

        expect(gymsQ3).toHaveLength(1);
    });

    it("should be able to search correctly paginated gyms by name", async () => {
        for (let i = 1; i < 23; i++) {
            vi.setSystemTime(new Date(2025, 0, i, 8, 0, 0));
            await new GymFactory(gymsRepository).create(`Gym ${i}`, `Test description ${i}`, "1234567890", 0, 0);
        }

        const { gyms: gymsQ1, meta: metaQ1 } = await new SearchGymsService(gymsRepository).execute({
            query: "Gym",
            page: 1,
        });

        expect(metaQ1).toEqual(expect.objectContaining({ totalPages: 2 }));
        expect(metaQ1).toEqual(expect.objectContaining({ totalRecords: 22 }));
    });
});
