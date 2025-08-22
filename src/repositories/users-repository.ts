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
    /**
     * Creates a new user in the system.
     *
     * @abstract
     * @param {Pick<User, "name" | "email" | "passwordHash">} data - User data to be created
     * @param {string} data.name - Full name of the user
     * @param {string} data.email - Unique email address of the user
     * @param {string} data.passwordHash - Hashed password of the user (already encrypted)
     * @returns {Promise<User>} Promise that resolves with the complete data of the created user
     *
     */
    abstract create(data: Pick<User, "name" | "email" | "passwordHash">): Promise<User>;

    /**
     * Retrieves all users registered in the system.
     *
     * @abstract
     * @returns {Promise<User[]>} Promise that resolves with array of all users
     * @description Returns empty array if no users are registered
     *
     */
    abstract read(): Promise<User[]>;

    /**
     * Updates data of an existing user.
     *
     * @abstract
     * @param {string} id - Unique identifier of the user to be updated
     * @param {Partial<Pick<User, "name" | "email" | "passwordHash">>} data - Partial data for update
     * @param {string} [data.name] - New user name (optional)
     * @param {string} [data.email] - New user email (optional)
     * @param {string} [data.passwordHash] - New password hash (optional)
     * @returns {Promise<User>} Promise that resolves with the updated user data
     *
     */
    abstract update(id: string, data: Partial<Pick<User, "name" | "email" | "passwordHash">>): Promise<User>;

    /**
     * Removes a user from the system.
     *
     * @abstract
     * @param {Object} by - Criteria to identify the user to be removed
     * @param {string} [by.id] - User ID (mutually exclusive with email)
     * @param {string} [by.email] - User email (mutually exclusive with id)
     * @returns {Promise<User>} Promise that resolves with the removed user data
     *
     */
    abstract delete(by: { id: string } | { email: string }): Promise<User>;

    /**
     * Finds a user by email address.
     *
     * @abstract
     * @param {string} email - Email address of the user to be found
     * @returns {Promise<User | null>} Promise that resolves with user data or null if not found
     * @description Useful for checking if an email is already registered or for authentication
     *
     */
    abstract findByEmail(email: string): Promise<User | null>;

    /**
     * Finds a user by id.
     *
     * @abstract
     * @param {string} id - Id of the user to be found
     * @returns {Promise<User | null>} Promise that resolves with user data or null if not found
     * @description Useful for checking the existence of a user with an information that never changes
     *
     */
    abstract findById(id: string): Promise<User | null>;
}
