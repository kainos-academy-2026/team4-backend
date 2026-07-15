export class JobNotFoundError extends Error {
	constructor() {
		super("Job role not found");
		this.name = "JobNotFoundError";
	}
}
