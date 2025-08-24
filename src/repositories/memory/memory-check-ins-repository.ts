import dayjs from "dayjs";

import { type CheckIn, CheckInsRepository } from "@/repositories/check-ins-repository.ts";

// Only repositories make the relation with the database

export class MemoryCheckInsRepository extends CheckInsRepository {
    private checkIns: CheckIn[] = [];

    async create(data: Pick<CheckIn, "userId" | "gymId"> & { validatedAt?: Date | null }) {
        const checkIn = {
            id: crypto.randomUUID(),
            ...data,
            validatedAt: data.validatedAt ? new Date(data.validatedAt) : null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        this.checkIns.push(checkIn);
        return checkIn;
    }

    async findByUserIdOnDate(userId: string, date: Date) {
        // const checkInOnSameDate = this.checkIns.find((checkIn) => {
        //     return userId === checkIn.userId && checkIn.createdAt.toDateString() === date.toDateString(); // toDateString gets only Date Timestamp (M-D-Y)
        // });

        const startOfDay = dayjs(date).startOf("day").toDate();
        const endOfDay = dayjs(date).endOf("day").toDate();

        const checkInOnSameDate = this.checkIns.find((checkIn) => {
            return userId === checkIn.userId && checkIn.createdAt >= startOfDay && checkIn.createdAt <= endOfDay;
        });

        return checkInOnSameDate || null;
    }

    async findManyByUserId(userId: string, page: number) {
        const limit = 20;
        const checkIns = this.checkIns
            .filter((checkIn) => checkIn.userId === userId)
            .slice((page - 1) * limit, page * limit);
        const totalPages = this.checkIns.length / limit;

        return { checkIns, meta: { totalPages, limit, page } };
    }

    async countByUserId(userId: string) {
        const checkIns = this.checkIns.filter((checkIn) => checkIn.userId === userId);
        const checkInsLength = checkIns.length;

        return checkInsLength;
    }
}
