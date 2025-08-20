import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { authenticateController } from "../controllers/authenticate-controller.ts";
import { authenticateSchema } from "../schemas/authenticate-schema.ts";

// Routes are responsible for defining the endpoints of the API and the middleware to be applied to them

export const authenticateRoutes: FastifyPluginAsyncZod = async (app) => {
    app.post(
        "/sessions",
        {
            schema: authenticateSchema,
        },
        authenticateController,
    );
};
