import dayjs from "dayjs";
import type { Prisma } from "generated/prisma/index.js";

import { prisma } from "@/lib/prisma.ts";
import { type CheckIn, CheckInsRepository } from "../check-ins-repository.ts";

export class PrismaCheckInsRepository extends CheckInsRepository {
    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = await prisma.checkIn.create({
            data,
            include: {
                user: true,
                gym: true,
            },
        });

        return checkIn;
    }

    async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
        const startOfDay = dayjs(date).startOf("day").toDate();
        const endOfDay = dayjs(date).endOf("day").toDate();

        const checkInOnSameDate = await prisma.checkIn.findUnique({
            where: { id: userId, createdAt: { gte: startOfDay, lte: endOfDay } },
        });

        return checkInOnSameDate || null;
    }
}
