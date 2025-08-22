import type { User, UsersRepository } from "@/repositories/users-repository.ts";
import { CreateUserService } from "@/services/create-user-service.ts";

export class UserFactory {
    private users: User[] = [];

    constructor(private usersRepository: UsersRepository) {}

    async create(name?: string, email?: string, password?: string) {
        const create = new CreateUserService(this.usersRepository);

        const { user } = await create.execute({
            name: name ?? "John Doe",
            email: email ?? "john.doe@example.com",
            password: password ?? "123456",
        });

        this.users.push(user);

        return { user };
    }
}
