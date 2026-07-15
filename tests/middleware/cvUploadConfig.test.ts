import { beforeEach, describe, expect, it, vi } from "vitest";

const singleMock = vi.hoisted(() => vi.fn(() => vi.fn()));
const memoryStorageMock = vi.hoisted(() =>
	vi.fn(() => ({ storage: "memory" })),
);
const multerFactoryMock = vi.hoisted(() =>
	vi.fn(() => ({
		single: singleMock,
	})),
);

const mockedMulterError = vi.hoisted(
	() =>
		class MockedMulterError extends Error {
			public code: string;
			constructor(code: string) {
				super(code);
				this.code = code;
			}
		},
);

vi.mock("multer", () => {
	Object.assign(multerFactoryMock, {
		memoryStorage: memoryStorageMock,
		MulterError: mockedMulterError,
	});

	return {
		default: multerFactoryMock,
		MulterError: mockedMulterError,
	};
});

describe("cvUpload middleware configuration", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("configures memory storage and cvFile field", async () => {
		await import("../../src/middleware/cvUploadMiddleware");

		expect(memoryStorageMock).toHaveBeenCalledTimes(1);
		expect(singleMock).toHaveBeenCalledWith("cvFile");
	});

	it("accepts allowed mime types in fileFilter", async () => {
		await import("../../src/middleware/cvUploadMiddleware");

		const multerConfig = multerFactoryMock.mock.calls[0]?.[0] as {
			fileFilter: (
				request: unknown,
				file: { mimetype: string },
				callback: (error: Error | null, accept?: boolean) => void,
			) => void;
		};

		const callback = vi.fn();
		multerConfig.fileFilter({}, { mimetype: "application/pdf" }, callback);

		expect(callback).toHaveBeenCalledWith(null, true);
	});

	it("rejects disallowed mime types in fileFilter", async () => {
		await import("../../src/middleware/cvUploadMiddleware");

		const multerConfig = multerFactoryMock.mock.calls[0]?.[0] as {
			fileFilter: (
				request: unknown,
				file: { mimetype: string },
				callback: (error: Error | null, accept?: boolean) => void,
			) => void;
		};

		const callback = vi.fn();
		multerConfig.fileFilter({}, { mimetype: "text/plain" }, callback);

		expect(callback).toHaveBeenCalledTimes(1);
		const callbackError = callback.mock.calls[0]?.[0];
		expect(callbackError).toBeInstanceOf(Error);
		expect((callbackError as Error).message).toBe(
			"Invalid file type. Allowed types: pdf, doc, docx",
		);
	});
});
