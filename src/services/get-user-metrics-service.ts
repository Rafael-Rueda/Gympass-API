import type { CheckIn, CheckInsRepository } from "@/repositories/check-ins-repository.ts";
import type { Meta } from "@/repositories/types/meta-type.ts";

interface GetUserMetricsServiceRequest {
    userId: string;
}

type GetUserMetricsServiceResponse = {
    checkInsCount: number;
};

export class GetUserMetricsService {
    constructor(private checkInRepository: CheckInsRepository) {}

    async execute({ userId }: GetUserMetricsServiceRequest): Promise<GetUserMetricsServiceResponse> {
        const checkInsCount = await this.checkInRepository.countByUserId(userId);

        return { checkInsCount };
    }
}
