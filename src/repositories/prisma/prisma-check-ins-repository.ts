import dayjs from "dayjs";
import type { Prisma } from "generated/prisma/index.js";

import { prisma } from "@/lib/prisma.ts";
import { type CheckIn, CheckInsRepository } from "@/repositories/check-ins-repository.ts";

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

        const checkInsOnSameDate = await prisma.checkIn.findMany({
            where: { id: userId, createdAt: { gte: startOfDay, lte: endOfDay } },
        });

        const checkInOnSameDate = checkInsOnSameDate[0];

        return checkInOnSameDate || null;
    }

    async findManyByUserId(userId: string, page: number) {
        const limit = 20;
        const checkIns = await prisma.checkIn.findMany({ where: { userId }, skip: (page - 1) * limit, take: limit });
        const totalRecords = await prisma.checkIn.count({ where: { userId } });
        const totalPages = Math.ceil(Number(totalRecords / limit));

        return { checkIns, meta: { totalPages, limit, page, totalRecords } };
    }

    async countByUserId(userId: string) {
        const checkIns = await prisma.checkIn.findMany({ where: { userId } });
        const checkInsLength = checkIns.length;

        return checkInsLength;
    }
}
