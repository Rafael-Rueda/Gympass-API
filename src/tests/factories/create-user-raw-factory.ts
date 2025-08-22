import { hash } from "bcryptjs";

import type { User, UsersRepository } from "@/repositories/users-repository.ts";

export class UserFactory {
    private users: User[] = [];

    constructor(private usersRepository: UsersRepository) {}

    async create(name?: string, email?: string, password?: string) {
        const user = await this.usersRepository.create({
            name: "John Doe",
            email: "john.doe@example.com",
            passwordHash: await hash("123456", 6),
        });

        this.users.push(user);

        return { user };
    }
}
