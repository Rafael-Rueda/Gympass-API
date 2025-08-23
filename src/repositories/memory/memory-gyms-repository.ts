import { type Gym, GymsRepository } from "@/repositories/gyms-repository.ts";

export class MemoryGymsRepository extends GymsRepository {
    private gyms: Gym[] = [];

    async create(data: Pick<Gym, "name" | "description" | "phone" | "latitude" | "longitude">) {
        const gym = {
            id: crypto.randomUUID(),
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        this.gyms.push(gym);
        return gym;
    }

    async read() {
        return this.gyms;
    }

    async update(id: string, data: Partial<Pick<Gym, "name" | "description" | "phone" | "latitude" | "longitude">>) {
        const gym = this.gyms.find((gym) => {
            return gym.id === id;
        });

        if (!gym) {
            return null;
        }

        Object.assign(gym, data);

        return gym;
    }

    async delete(id: string) {
        const gym = this.gyms.find((gym) => {
            return gym.id === id;
        });

        if (!gym) {
            return null;
        }

        this.gyms.filter((g) => {
            return g.id !== gym.id;
        });

        return gym;
    }

    async findById(id: string) {
        const gym = this.gyms.find((gym) => {
            return gym.id === id;
        });

        return gym || null;
    }
}
