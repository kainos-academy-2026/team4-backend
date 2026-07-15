export default class UserAlreadyExistsError extends Error {
	constructor() {
		super("User already exists");
		this.name = "UserAlreadyExistsError";
	}
}
