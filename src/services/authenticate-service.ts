import { compare } from "bcryptjs";

import { InvalidCredentialsError } from "./errors/invalid-credentials-error.ts";
import type { UserData, UsersRepository } from "@/repositories/users-repository.ts";

interface AuthenticateServiceRequest {
    email: string;
    password: string;
}

type AuthenticateServiceResponse = {
    user: UserData;
};

export class AuthenticateService {
    constructor(private UsersRepository: UsersRepository) {}

    async execute({ email, password }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
        const user = await this.UsersRepository.findByEmail(email);

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
