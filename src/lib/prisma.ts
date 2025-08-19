import { env } from "@/env/index.ts";
import { PrismaClient } from "../../generated/prisma/index.js";

export const prisma = new PrismaClient({
    log: env.NODE_ENV !== "production" ? ["query"] : [],
});
