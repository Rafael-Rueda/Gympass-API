// Interface genérica que não depende do Prisma
export interface UserData {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

export abstract class UsersRepository {
    // Usando Partial e Pick da própria UserData
    abstract create(data: Pick<UserData, "name" | "email" | "passwordHash">): Promise<UserData>;
    abstract read(): Promise<UserData[]>;
    abstract update(id: string, data: Partial<Pick<UserData, "name" | "email" | "passwordHash">>): Promise<UserData>;
    abstract delete(by: { id: string } | { email: string }): Promise<UserData>;
    abstract findByEmail(email: string): Promise<UserData | null>;
}
