import { describe, expect, it } from "vitest";
import { JobNotFoundError } from "../../../src/services/errors/jobNotFoundError";

describe("JobNotFoundError", () => {
	it("is an instance of Error", () => {
		const error = new JobNotFoundError();
		expect(error).toBeInstanceOf(Error);
	});

	it("has the correct name", () => {
		const error = new JobNotFoundError();
		expect(error.name).toBe("JobNotFoundError");
	});

	it("has the correct message", () => {
		const error = new JobNotFoundError();
		expect(error.message).toBe("Job role not found");
	});
});
