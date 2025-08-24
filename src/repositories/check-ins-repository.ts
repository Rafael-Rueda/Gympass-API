import type { Meta } from "@/repositories/types/meta-type.ts";
export interface CheckIn {
    id: string;
    validatedAt: Date | null;
    userId: string;
    gymId: string;
    createdAt: Date;
    updatedAt: Date;
}

// Define the data needed to create a CheckIn (not picking from CheckIn interface since it has full objects)
// export interface CheckInCreateData {
//     user: { connect: { id: string } };
//     gym: { connect: { id: string } };
// }
// This is for user obj and gym obj usage.

export abstract class CheckInsRepository {
    abstract create(data: Pick<CheckIn, "userId" | "gymId"> & { validatedAt?: Date | null }): Promise<CheckIn>;
    abstract findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
    abstract findManyByUserId(userId: string, page: number): Promise<{ checkIns: CheckIn[]; meta: Meta }>;
    abstract countByUserId(userId: string): Promise<number>;
}
