import type { Gym, GymsRepository } from "@/repositories/gyms-repository.ts";
import { CreateGymService } from "@/services/create-gym-service.ts";

export class GymFactory {
    private gyms: Gym[] = [];

    constructor(private gymsRepository: GymsRepository) {}

    async create(name?: string, description?: string, phone?: string, latitude?: number, longitude?: number) {
        const create = new CreateGymService(this.gymsRepository);

        const { gym } = await create.execute({
            name: name ?? "John Doe's Gym",
            description:
                description ??
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa, beatae nulla omnis cum reprehenderit nobis accusamus qui. Accusamus odio voluptate dolorem architecto impedit. A harum ipsam illo ipsa quam at.",
            phone: phone ?? "123456-7",
            latitude: latitude ?? 0,
            longitude: longitude ?? 0,
        });

        this.gyms.push(gym);

        return { gym };
    }
}
