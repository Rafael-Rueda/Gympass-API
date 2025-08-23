import { hash } from "bcryptjs";

import type { Gym, GymsRepository } from "@/repositories/gyms-repository.ts";
import type { User, UsersRepository } from "@/repositories/users-repository.ts";

export class GymFactory {
    private gyms: Gym[] = [];

    constructor(private usersRepository: GymsRepository) {}

    async create(name?: string, description?: string, phone?: string, latitude?: number, longitude?: number) {
        const gym = await this.usersRepository.create({
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
