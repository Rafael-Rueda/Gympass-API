export class UserAlreadyExistsError extends Error {
    constructor() {
        super("An user with this e-mail already exists.");
    }
}
