import { compare } from "bcryptjs";

import { InvalidCredentialsError } from "./errors/invalid-credentials-error.ts";
import type { CheckIn, CheckInsRepository } from "@/repositories/check-ins-repository.ts";

interface CheckInServiceRequest {
    userId: string;
    gymId: string;
}

type CheckInServiceResponse = {
    checkIn: CheckIn;
};

export class CheckInService {
    constructor(private checkInRepository: CheckInsRepository) {}

    async execute({ userId, gymId }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
        const hasCheckInToday = await this.checkInRepository.findByUserIdOnDate(userId, new Date());

        if (hasCheckInToday) {
            throw new Error();
        }

        const checkIn = await this.checkInRepository.create({ userId, gymId });

        return {
            checkIn,
        };
    }
}
