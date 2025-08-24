import type { Prisma, Gym as PrismaGym } from "generated/prisma/index.js";

import { prisma } from "@/lib/prisma.ts";
import { type Gym, GymsRepository } from "@/repositories/gyms-repository.ts";

export class PrismaGymsRepository extends GymsRepository {
    async create(data: Pick<Gym, "name" | "description" | "phone" | "latitude" | "longitude">) {
        const gym = await prisma.gym.create({ data: { ...data } });

        return { ...gym, latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() };
    }

    async read(page: number) {
        const limit = 20;
        const gyms = await prisma.gym.findMany({ skip: (page - 1) * limit, take: limit });
        const totalRecords = await prisma.gym.count();
        const totalPages = Math.ceil(Number(totalRecords / limit));

        const parsedGyms = gyms.map((gym) => {
            return { ...gym, latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() };
        });

        return { gyms: parsedGyms, meta: { totalPages, limit, page, totalRecords } };
    }

    async update(id: string, data: Partial<Pick<Gym, "name" | "description" | "phone" | "latitude" | "longitude">>) {
        const gym = await prisma.gym.update({ where: { id }, data: { ...data } });

        if (gym) {
            return { ...gym, latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() };
        }

        return null;
    }

    async delete(id: string) {
        const gym = await prisma.gym.delete({ where: { id: id } });

        if (gym) {
            return { ...gym, latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() };
        }

        return null;
    }

    async findById(id: string) {
        const gym = await prisma.gym.findFirst({ where: { id } });

        if (gym) {
            return { ...gym, latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() };
        }

        return null;
    }

    async searchMany(query: string, page: number) {
        const limit = 20;

        const whereCondition: Prisma.GymWhereInput = {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
            ],
        };

        const gyms = await prisma.gym.findMany({
            where: whereCondition,
            skip: (page - 1) * 20,
            take: 20,
        });

        const totalRecords = await prisma.gym.count({ where: whereCondition });
        const totalPages = Math.ceil(Number(totalRecords / limit));

        const parsedGyms = gyms.map((gym) => {
            return { ...gym, latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() };
        });

        return { gyms: parsedGyms, meta: { totalPages, limit, page, totalRecords } };
    }

    async findManyNearby(params: { latitude: number; longitude: number }, page: number) {
        const MAX_DISTANCE_KM = 10;
        const limit = 20;
        const offset = (page - 1) * limit;

        // Query SQL raw com fórmula Haversine
        const gyms = await prisma.$queryRaw<(PrismaGym & { distance: number })[]>`
            SELECT *, (
                6371 * acos(
                    cos(radians(${params.latitude})) * 
                    cos(radians(latitude)) * 
                    cos(radians(longitude) - radians(${params.longitude})) + 
                    sin(radians(${params.latitude})) * 
                    sin(radians(latitude))
                )
            ) AS distance
            FROM "Gym"
            WHERE (
                6371 * acos(
                    cos(radians(${params.latitude})) * 
                    cos(radians(latitude)) * 
                    cos(radians(longitude) - radians(${params.longitude})) + 
                    sin(radians(${params.latitude})) * 
                    sin(radians(latitude))
                )
            ) <= ${MAX_DISTANCE_KM}
            ORDER BY distance
            LIMIT ${limit}
            OFFSET ${offset}
        `;

        // Conta o total para paginação
        const totalCount = await prisma.$queryRaw<[{ count: bigint }]>`
            SELECT COUNT(*) as count
            FROM "Gym"
            WHERE (
                6371 * acos(
                    cos(radians(${params.latitude})) * 
                    cos(radians(latitude)) * 
                    cos(radians(longitude) - radians(${params.longitude})) + 
                    sin(radians(${params.latitude})) * 
                    sin(radians(latitude))
                )
            ) <= ${MAX_DISTANCE_KM}
        `;

        const parsedGyms = gyms.map((gym) => {
            return {
                ...gym,
                latitude: gym.latitude.toNumber(),
                longitude: gym.longitude.toNumber(),
            };
        });

        const totalRecords = Number(totalCount[0].count);

        const totalPages = Math.ceil(Number(Math.ceil(totalRecords / limit)));

        return {
            gyms: parsedGyms,
            meta: { totalPages, limit, page, totalRecords },
        };
    }
}
