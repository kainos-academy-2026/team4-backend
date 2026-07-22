import { MulterError } from "multer";
import { describe, expect, it, vi } from "vitest";
import { handleCvUploadErrors } from "../../src/middleware/cvUploadMiddleware";

describe("handleCvUploadErrors", () => {
	const makeResponse = () => {
		const json = vi.fn();
		const status = vi.fn(() => ({ json }));
		return { status, json };
	};

	it("returns 400 with message for a generic Error", () => {
		const error = new Error("Invalid file type. Allowed types: pdf, doc, docx");
		const response = makeResponse();
		const next = vi.fn();

		handleCvUploadErrors(error, {} as never, response as never, next);

		expect(response.status).toHaveBeenCalledWith(400);
		expect(response.status(400).json).toHaveBeenCalledWith({
			message: "Invalid file type. Allowed types: pdf, doc, docx",
		});
		expect(next).not.toHaveBeenCalled();
	});

	it("returns 400 with message for a MulterError", () => {
		const error = new MulterError("LIMIT_FILE_SIZE");
		const response = makeResponse();
		const next = vi.fn();

		handleCvUploadErrors(error, {} as never, response as never, next);

		expect(response.status).toHaveBeenCalledWith(400);
		expect(next).not.toHaveBeenCalled();
	});

	it("calls next for non-Error values", () => {
		const response = makeResponse();
		const next = vi.fn();

		handleCvUploadErrors(
			"some string error",
			{} as never,
			response as never,
			next,
		);

		expect(next).toHaveBeenCalledWith("some string error");
		expect(response.status).not.toHaveBeenCalled();
	});
});
