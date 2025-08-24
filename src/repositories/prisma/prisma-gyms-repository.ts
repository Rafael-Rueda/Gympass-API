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
        const totalPages = (await prisma.gym.count()) / limit;

        const parsedGyms = gyms.map((gym) => {
            return { ...gym, latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() };
        });

        return { gyms: parsedGyms, meta: { totalPages, limit, page } };
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
        const gyms = await prisma.gym.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            },
            skip: (page - 1) * 20,
            take: 20,
        });
        const totalPages = await prisma.gym.count();

        const parsedGyms = gyms.map((gym) => {
            return { ...gym, latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() };
        });

        return { gyms: parsedGyms, meta: { totalPages, limit, page } };
    }
}
