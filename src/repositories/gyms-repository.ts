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
    abstract read(): Promise<Gym[]>;
    abstract update(
        id: string,
        data: Partial<Pick<Gym, "name" | "description" | "phone" | "latitude" | "longitude">>,
    ): Promise<Gym | null>;
    abstract delete(id: string): Promise<Gym | null>;
    abstract findById(id: string): Promise<Gym | null>;
}
