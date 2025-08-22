import fastifySwagger from "@fastify/swagger";
import fastifyScalarUi from "@scalar/fastify-api-reference";
import fastify from "fastify";
import {
    hasZodFastifySchemaValidationErrors,
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider,
} from "fastify-type-provider-zod";
import z from "zod";

import { env } from "./env/index.ts";
import { authenticate } from "./http/routes/authenticate.ts";
import { InvalidCredentialsError } from "./services/errors/invalid-credentials-error.ts";
import { ResourceNotFoundError } from "./services/errors/resource-not-found-error.ts";
import { UserAlreadyExistsError } from "./services/errors/user-already-exists-error.ts";
import { createUser } from "@/http/routes/create-user.ts";
export const app = fastify().withTypeProvider<ZodTypeProvider>();

if (env.NODE_ENV === "development") {
    app.register(fastifySwagger, {
        openapi: {
            info: {
                title: "GymPass API",
                version: "1.0.0",
            },
        },
        transform: jsonSchemaTransform,
    });

    app.register(fastifyScalarUi, {
        routePrefix: "/docs",
        configuration: {
            theme: "kepler",
        },
    });
}

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// I18N
z.config(z.locales.en());

// Middlewares

// Plugins
app.register(createUser);
app.register(authenticate);

// Error handling
app.setErrorHandler((error, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
        return reply.code(400).send({
            error: "Response Validation Error",
            message: "Request doesn't match the schema",
            statusCode: 400,
            details: {
                issues: error.validation.map((issue) => {
                    return { message: issue.message, path: issue.instancePath.split("/").pop() };
                }),
                method: request.method,
                url: request.url,
            },
        });
    }

    if (error instanceof UserAlreadyExistsError) {
        return reply.status(409).send({
            message: error.message,
            error: "UserAlreadyExistsError",
            details: {
                issues: [
                    {
                        message: error.message,
                        path: "email",
                    },
                ],
            },
        });
    }

    if (error instanceof ResourceNotFoundError) {
        return reply.status(404).send({
            message: error.message,
            error: "ResourceNotFoundError",
        });
    }

    if (error instanceof InvalidCredentialsError) {
        return reply.status(401).send({
            message: error.message,
            error: "InvalidCredentialsError",
        });
    }

    if (env.NODE_ENV !== "production") {
        console.error(error);
    } else {
        // TODO: Log to an external tool like DataDog/NewRelic/Sentry
    }

    return reply.status(500).send({ message: "Internal server error." });
});
