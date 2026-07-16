export class S3UploadError extends Error {
	constructor(cause: unknown) {
		super("Failed to upload CV to storage");
		this.name = "S3UploadError";
		this.cause = cause;
	}
}
