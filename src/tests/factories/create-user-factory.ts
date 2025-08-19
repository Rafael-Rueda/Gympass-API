import type { UserData, UsersRepository } from "@/repositories/users-repository.ts";
import { createUserService } from "@/services/create-user-service.ts";

export class UserFactory {
    private users: UserData[] = [];

    constructor(private usersRepository: UsersRepository) {}

    async create(name?: string, email?: string, password?: string) {
        const create = new createUserService(this.usersRepository);

        const user = await create.execute({
            name: name ?? "John Doe",
            email: email ?? "john.doe@example.com",
            password: password ?? "123456",
        });

        this.users.push(user);

        return user;
    }
}
