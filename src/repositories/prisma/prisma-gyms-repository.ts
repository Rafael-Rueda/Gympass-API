import { prisma } from "@/lib/prisma.ts";
import { type Gym, GymsRepository } from "@/repositories/gyms-repository.ts";

export class PrismaGymsRepository extends GymsRepository {
    async create(data: Pick<Gym, "name" | "description" | "phone" | "latitude" | "longitude">) {
        const gym = await prisma.gym.create({ data: { ...data } });

        return { ...gym, latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() };
    }

    async read(): Promise<Gym[]> {
        const gyms = await prisma.gym.findMany();

        return gyms.map((gym) => {
            return { ...gym, latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() };
        });
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
}
