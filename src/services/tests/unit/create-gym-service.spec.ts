import { describe, expect, it } from "vitest";

import { MemoryGymsRepository } from "@/repositories/memory/memory-gyms-repository.ts";
import { GymFactory } from "@/tests/factories/create-gym-service-factory.ts";

describe("Create user test services", () => {
    it("should be able to create a gym", async () => {
        const createGym = new GymFactory(new MemoryGymsRepository());

        const { gym } = await createGym.create();

        expect(gym.id).toEqual(expect.any(String));
    });
});
