import { hash } from "bcryptjs";

import { UserAlreadyExistsError } from "./errors/user-already-exists-error.ts";
import type { UserData, UsersRepository } from "@/repositories/users-repository.ts";

interface createUserServiceRequest {
    name: string;
    email: string;
    password: string;
}

interface createUserServiceResponse {
    user: UserData;
}

export class createUserService {
    constructor(private usersRepository: UsersRepository) {}

    async execute({ name, email, password }: createUserServiceRequest): Promise<createUserServiceResponse> {
        const userWithSameEmail = await this.usersRepository.findByEmail(email);

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError();
        }

        const passwordHash = await hash(password, 6);

        const user = await this.usersRepository.create({ name, email, passwordHash });

        return { user };
    }
}
