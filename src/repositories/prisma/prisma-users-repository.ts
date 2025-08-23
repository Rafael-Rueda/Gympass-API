import type { Prisma } from "generated/prisma/index.js";

import { prisma } from "@/lib/prisma.ts";
import { UsersRepository } from "../users-repository.ts";

// Only repositories make the relation with the database

export class PrismaUsersRepository extends UsersRepository {
    async create(data: Prisma.UserCreateInput) {
        const user = await prisma.user.create({ data });

        return user;
    }

    async read() {
        const users = await prisma.user.findMany();
        return users;
    }

    async update(id: string, data: Prisma.UserUpdateInput) {
        const user = await prisma.user.update({
            where: { id: id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.email && { email: data.email }),
                ...(data.passwordHash && { passwordHash: data.passwordHash }),
            },
        });

        if (user) {
            return user;
        }

        return null;
    }

    async delete(by: { id: string } | { email: string }) {
        const user = await prisma.user.delete({
            where: by,
        });

        if (user) {
            return user;
        }

        return null;
    }

    async findByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        return user;
    }

    async findById(id: string) {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });

        return user;
    }
}
