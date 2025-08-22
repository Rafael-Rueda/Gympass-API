import { hash } from "bcryptjs";

import { UserAlreadyExistsError } from "./errors/user-already-exists-error.ts";
import type { User, UsersRepository } from "@/repositories/users-repository.ts";

interface CreateUserServiceRequest {
    name: string;
    email: string;
    password: string;
}

interface CreateUserServiceResponse {
    user: User;
}

export class CreateUserService {
    constructor(private usersRepository: UsersRepository) {}

    async execute({ name, email, password }: CreateUserServiceRequest): Promise<CreateUserServiceResponse> {
        const userWithSameEmail = await this.usersRepository.findByEmail(email);

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError();
        }

        const passwordHash = await hash(password, 6);

        const user = await this.usersRepository.create({ name, email, passwordHash });

        return { user };
    }
}
