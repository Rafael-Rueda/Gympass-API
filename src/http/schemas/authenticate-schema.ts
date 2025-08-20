import { z } from "zod";

export const authenticateSchema = {
    tags: ["Authentication"],
    summary: "Authenticate an user",
    body: z.object({
        email: z.email(),
        password: z.string().min(3),
    }),
    response: {
        200: z.object({}),
        401: z.object({
            message: z.string(),
            error: z.string(),
        }),
    },
};

export type AuthenticateBody = z.infer<(typeof authenticateSchema)["body"]>;
