export class UserAlreadyCheckInError extends Error {
    constructor() {
        super("The user already did a check in today.");
    }
}
