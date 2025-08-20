import type { FastifyReply, FastifyRequest } from "fastify";

import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository.ts";
import { AuthenticateService } from "@/services/authenticate.ts";
import type { AuthenticateBody } from "../schemas/authenticate-schema.ts";
import type { CreateUserBody } from "../schemas/create-user-schema.ts";

// Controllers are responsible for handling the request and returning a response to the client

export const authenticateController = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as AuthenticateBody;
    reply.headers({ "content-type": "application/json" });

    const authenticate = new AuthenticateService(new PrismaUsersRepository());

    const { user } = await authenticate.execute({ email, password });

    return reply.status(200).send();
};
