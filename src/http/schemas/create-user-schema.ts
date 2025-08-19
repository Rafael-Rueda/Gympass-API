import { z } from "zod";

export const createUserSchema = {
    tags: ["Users"],
    summary: "Create an user",
    body: z.object({
        name: z.string().min(3),
        email: z.email(),
        password: z.string().min(3),
    }),
    response: {
        201: z.object({ userId: z.uuid() }).describe("User created succesfully"),
        409: z
            .object({
                message: z.string(),
                error: z.string(),
                details: z.object({
                    issues: z.array(z.object({ message: z.string(), path: z.string() })),
                }),
            })
            .describe("User with specified e-mail already exists in the database"),
        400: z
            .object({
                error: z.string(),
                message: z.string(),
                statusCode: z.number(),
                details: z.object({
                    issues: z.array(z.object({ message: z.string(), path: z.string() })),
                }),
            })
            .describe("Request doesn't match the schema"),
        404: z
            .object({
                message: z.string(),
                error: z.string(),
            })
            .describe("Resource not found"),
        500: z.object({ message: z.string() }).describe("Internal server error"),
    },
};

export type CreateUserBody = z.infer<(typeof createUserSchema)["body"]>;
