import type { Meta } from "@/repositories/types/meta-type.ts";

export interface Gym {
    id: string;
    name: string;
    description: string | null;
    phone: string | null;
    latitude: number;
    longitude: number;
    createdAt: Date;
    updatedAt: Date;
}

export abstract class GymsRepository {
    abstract create(data: Pick<Gym, "name" | "description" | "phone" | "latitude" | "longitude">): Promise<Gym>;
    abstract read(page: number): Promise<{ gyms: Gym[]; meta: Meta }>;
    abstract update(
        id: string,
        data: Partial<Pick<Gym, "name" | "description" | "phone" | "latitude" | "longitude">>,
    ): Promise<Gym | null>;
    abstract delete(id: string): Promise<Gym | null>;
    abstract findById(id: string): Promise<Gym | null>;
    abstract searchMany(query: string, page: number): Promise<{ gyms: Gym[]; meta: Meta }>;
    abstract findManyNearby(
        params: { latitude: number; longitude: number },
        page: number,
    ): Promise<{ gyms: Gym[]; meta: Meta }>;
}
