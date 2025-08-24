import type { Meta } from "@/repositories/types/meta-type.ts";

// Generic interface that do not depends on Prisma
export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Abstract repository for user CRUD operations.
 *
 * This class defines the standard interface that all concrete
 * user repository implementations must follow, ensuring
 * consistency in data persistence operations.
 *
 * Note: This repository layer focuses solely on data persistence
 * and does not handle business logic validation or error throwing.
 * Error handling and business rules are managed by the service layer.
 *
 * @abstract
 * @class UsersRepository
 */
export abstract class UsersRepository {
    abstract create(data: Pick<User, "name" | "email" | "passwordHash">): Promise<User>;
    abstract read(page: number): Promise<{ users: User[]; meta: Meta }>;
    abstract update(id: string, data: Partial<Pick<User, "name" | "email" | "passwordHash">>): Promise<User | null>;
    abstract delete(by: { id: string } | { email: string }): Promise<User | null>;
    abstract findByEmail(email: string): Promise<User | null>;
    abstract findById(id: string): Promise<User | null>;
}
