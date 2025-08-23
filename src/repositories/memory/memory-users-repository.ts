import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error.ts";
import { type User, UsersRepository } from "../users-repository.ts";

// Only repositories make the relation with the database

export class MemoryUsersRepository extends UsersRepository {
    private users: User[] = [];

    async create(data: Pick<User, "name" | "email" | "passwordHash">) {
        const user = {
            id: crypto.randomUUID(),
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        this.users.push(user);
        return user;
    }

    async read() {
        return this.users;
    }

    async update(id: string, data: Partial<Pick<User, "name" | "email" | "passwordHash">>) {
        const user = this.users.find((user) => user.id === id);
        if (!user) {
            return null;
        }

        Object.assign(user, data);

        return user;
    }

    async delete(by: { id: string } | { email: string }) {
        let user: User | undefined;

        if ("id" in by) {
            user = this.users.find((user) => user.id === by.id);

            if (!user) {
                return null;
            }

            this.users = this.users.filter((u) => u.id !== user!.id);
        } else {
            user = this.users.find((user) => user.email === by.email);

            if (!user) {
                return null;
            }

            this.users = this.users.filter((u) => u.email !== user!.email);
        }

        return user;
    }

    async findByEmail(email: string) {
        const user = this.users.find((user) => user.email === email);
        return user || null;
    }

    async findById(id: string) {
        const user = this.users.find((user) => user.id === id);
        return user || null;
    }
}
