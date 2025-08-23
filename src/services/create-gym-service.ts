import type { Gym, GymsRepository } from "@/repositories/gyms-repository.ts";

interface CreateGymServiceRequest {
    name: string;
    description: string | null;
    phone: string | null;
    latitude: number;
    longitude: number;
}

interface CreateGymServiceResponse {
    gym: Gym;
}

export class CreateGymService {
    constructor(private gymsRepository: GymsRepository) {}

    async execute({
        name,
        description,
        phone,
        latitude,
        longitude,
    }: CreateGymServiceRequest): Promise<CreateGymServiceResponse> {
        const gym = await this.gymsRepository.create({ name, description, phone, latitude, longitude });

        return { gym };
    }
}
