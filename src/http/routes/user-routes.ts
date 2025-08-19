import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { createUserController } from "../controllers/create-user-controller.ts";
import { createUserSchema } from "../schemas/create-user-schema.ts";

// Routes are responsible for defining the endpoints of the API and the middleware to be applied to them

export const userRoutes: FastifyPluginAsyncZod = async (app) => {
    // POST Create User Route
    app.post(
        "/users",
        {
            preHandler: [],
            schema: createUserSchema,
        },
        createUserController,
    );
};
