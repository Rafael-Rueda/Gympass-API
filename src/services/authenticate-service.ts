import { compare } from "bcryptjs";

import { InvalidCredentialsError } from "./errors/invalid-credentials-error.ts";
import type { User, UsersRepository } from "@/repositories/users-repository.ts";

interface AuthenticateServiceRequest {
    email: string;
    password: string;
}

type AuthenticateServiceResponse = {
    user: User;
};

export class AuthenticateService {
    constructor(private usersRepository: UsersRepository) {}

    async execute({ email, password }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new InvalidCredentialsError();
        }

        const doesPasswordMatches = await compare(password, user.passwordHash);

        if (!doesPasswordMatches) {
            throw new InvalidCredentialsError();
        }

        return {
            user,
        };
    }
}
