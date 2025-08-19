import type { Prisma } from "generated/prisma/index.js";

import { prisma } from "@/lib/prisma.ts";
import { type UserData, UsersRepository } from "../users-repository.ts";

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

        return user;
    }

    async delete(by: { id: string } | { email: string }) {
        const user = await prisma.user.delete({
            where: by,
        });

        return user;
    }

    async findByEmail(email: UserData["email"]) {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        return user;
    }
}
