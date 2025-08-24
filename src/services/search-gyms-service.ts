import type { Gym, GymsRepository } from "@/repositories/gyms-repository.ts";
import type { Meta } from "@/repositories/types/meta-type.ts";
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error.ts";

interface SearchGymsServiceRequest {
    query: string;
    page: number;
}

interface SearchGymsServiceResponse {
    gyms: Gym[];
    meta: Meta;
}

export class SearchGymsService {
    constructor(private gymsRepository: GymsRepository) {}

    async execute({ query, page }: SearchGymsServiceRequest): Promise<SearchGymsServiceResponse> {
        const { gyms, meta } = await this.gymsRepository.searchMany(query, page);

        if (gyms.length === 0) {
            throw new ResourceNotFoundError();
        }

        return { gyms, meta };
    }
}
