import { describe, expect, it } from "vitest";
import { S3UploadError } from "../../../src/services/errors/s3UploadError";

describe("S3UploadError", () => {
	it("is an instance of Error", () => {
		const cause = new Error("S3 unavailable");
		const error = new S3UploadError(cause);
		expect(error).toBeInstanceOf(Error);
	});

	it("has the correct name", () => {
		const error = new S3UploadError(new Error("cause"));
		expect(error.name).toBe("S3UploadError");
	});

	it("has the correct message", () => {
		const error = new S3UploadError(new Error("cause"));
		expect(error.message).toBe("Failed to upload CV to storage");
	});

	it("stores the cause", () => {
		const cause = new Error("original cause");
		const error = new S3UploadError(cause);
		expect(error.cause).toBe(cause);
	});
});
