import type { CheckIn, CheckInsRepository } from "@/repositories/check-ins-repository.ts";
import type { Meta } from "@/repositories/types/meta-type.ts";

interface FetchUserCheckInsServiceRequest {
    userId: string;
    page: number;
}

type FetchUserCheckInsServiceResponse = {
    checkIns: CheckIn[];
    meta: Meta;
};

export class FetchUserCheckInsService {
    constructor(private checkInRepository: CheckInsRepository) {}

    async execute({ userId, page }: FetchUserCheckInsServiceRequest): Promise<FetchUserCheckInsServiceResponse> {
        const { checkIns, meta } = await this.checkInRepository.findManyByUserId(userId, page);

        return {
            checkIns,
            meta,
        };
    }
}
