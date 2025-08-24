import type { Gym, GymsRepository } from "@/repositories/gyms-repository.ts";
import type { Meta } from "@/repositories/types/meta-type.ts";
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error.ts";

interface FetchNearbyGymsServiceRequest {
    userLatitude: number;
    userLongitude: number;
    page: number;
}

interface FetchNearbyGymsServiceResponse {
    gyms: Gym[];
    meta: Meta;
}

export class FetchNearbyGymsService {
    constructor(private gymsRepository: GymsRepository) {}

    async execute({
        userLatitude,
        userLongitude,
        page,
    }: FetchNearbyGymsServiceRequest): Promise<FetchNearbyGymsServiceResponse> {
        const { gyms, meta } = await this.gymsRepository.findManyNearby(
            {
                latitude: userLatitude,
                longitude: userLongitude,
            },
            page,
        );

        return { gyms, meta };
    }
}
