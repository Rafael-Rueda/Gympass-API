import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates.ts";

import type { CheckIn, CheckInsRepository } from "@/repositories/check-ins-repository.ts";
import type { GymsRepository } from "@/repositories/gyms-repository.ts";
import { MaxDistanceError } from "@/services/errors/max-distance-error.ts";
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error.ts";
import { UserAlreadyCheckInError } from "@/services/errors/user-already-check-in-error.ts";

interface CheckInServiceRequest {
    userId: string;
    gymId: string;
    userLatitude: number;
    userLongitude: number;
}

type CheckInServiceResponse = {
    checkIn: CheckIn;
};

export class CheckInService {
    constructor(
        private checkInRepository: CheckInsRepository,
        private gymsRepository: GymsRepository,
    ) {}

    async execute({
        userId,
        gymId,
        userLatitude,
        userLongitude,
    }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
        const gym = await this.gymsRepository.findById(gymId);

        const hasCheckInToday = await this.checkInRepository.findByUserIdOnDate(userId, new Date());

        if (!gym) {
            throw new ResourceNotFoundError();
        }

        if (hasCheckInToday) {
            throw new UserAlreadyCheckInError();
        }

        // Calculate distance between user and gym

        const MAX_DISTANCE_KM = 0.1;

        const distanceKM = getDistanceBetweenCoordinates(
            {
                latitude: userLatitude,
                longitude: userLongitude,
            },
            {
                latitude: gym.latitude,
                longitude: gym.longitude,
            },
        );

        if (distanceKM > MAX_DISTANCE_KM) {
            throw new MaxDistanceError();
        }

        const checkIn = await this.checkInRepository.create({ userId, gymId });

        return {
            checkIn,
        };
    }
}
