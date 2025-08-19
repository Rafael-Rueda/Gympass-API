import type { FastifyReply, FastifyRequest } from "fastify";

import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository.ts";
import { createUserService } from "@/services/create-user-service.ts";
import type { CreateUserBody } from "../schemas/create-user-schema.ts";

// Controllers are responsible for handling the request and returning a response to the client

export const createUserController = async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, email, password } = request.body as CreateUserBody;
    reply.headers({ "content-type": "application/json" });

    const create = new createUserService(new PrismaUsersRepository());

    const { user } = await create.execute({ name, email, password });

    return reply.status(201).send({ userId: user.id });
};
