import { beforeEach, describe, expect, it, vi } from "vitest";
import { JobApplicationController } from "../../src/controller/jobApplicationController";
import type { JobApplicationService } from "../../src/services/jobApplicationService";
import {
	InvalidApplicationPayloadError,
	JobNotFoundError,
	S3UploadError,
} from "../../src/services/jobApplicationService";

const makeRequest = (overrides: Record<string, unknown> = {}) => ({
	params: { id: "1" },
	user: { userId: "user-abc", email: "test@example.com", role: "user" },
	query: {},
	body: {
		s3Key: "cvs/1/user-abc/uuid-cv.pdf",
		cvFileName: "cv.pdf",
		cvMimeType: "application/pdf",
		cvSizeBytes: 1024,
	},
	...overrides,
});

const makeResponse = () => {
	const json = vi.fn();
	const status = vi.fn(() => ({ json }));
	return { status, json };
};

const mockService = {
	createApplication: vi.fn(),
	getApplicationForRole: vi.fn(),
	generateUploadUrl: vi.fn(),
} as unknown as JobApplicationService;

describe("JobApplicationController", () => {
	let controller: JobApplicationController;

	beforeEach(() => {
		vi.clearAllMocks();
		controller = new JobApplicationController(mockService);
	});

	describe("getUploadUrl", () => {
		it("returns 200 with presignedUrl and s3Key on success", async () => {
			const uploadUrlResult = {
				presignedUrl: "https://s3.example.com/presigned",
				s3Key: "cvs/1/user-abc/uuid-cv.pdf",
			};
			vi.mocked(mockService.generateUploadUrl).mockResolvedValue(
				uploadUrlResult,
			);

			const response = makeResponse();
			const next = vi.fn();

			await controller.getUploadUrl(
				makeRequest({
					query: { fileName: "cv.pdf", mimeType: "application/pdf" },
				}) as never,
				response as never,
				next,
			);

			expect(response.status).toHaveBeenCalledWith(200);
			expect(response.status(200).json).toHaveBeenCalledWith(uploadUrlResult);
			expect(next).not.toHaveBeenCalled();
		});

		it("returns 200 without fileName query param", async () => {
			vi.mocked(mockService.generateUploadUrl).mockResolvedValue({
				presignedUrl: "https://s3.example.com/presigned",
				s3Key: "cvs/1/user-abc/uuid.bin",
			});

			const response = makeResponse();
			await controller.getUploadUrl(
				makeRequest({ query: { mimeType: "application/pdf" } }) as never,
				response as never,
				vi.fn(),
			);

			expect(mockService.generateUploadUrl).toHaveBeenCalledWith({
				jobRoleId: 1,
				applicantId: "user-abc",
				mimeType: "application/pdf",
				fileName: undefined,
			});
		});

		it("returns 400 when mimeType is missing", async () => {
			const response = makeResponse();

			await controller.getUploadUrl(
				makeRequest({ query: { fileName: "cv.pdf" } }) as never,
				response as never,
				vi.fn(),
			);

			expect(response.status).toHaveBeenCalledWith(400);
			expect(response.status(400).json).toHaveBeenCalledWith({
				message: "mimeType is required",
			});
			expect(mockService.generateUploadUrl).not.toHaveBeenCalled();
		});

		it("returns 401 when no authenticated user", async () => {
			const response = makeResponse();
			const next = vi.fn();

			await controller.getUploadUrl(
				makeRequest({ user: undefined }) as never,
				response as never,
				next,
			);

			expect(response.status).toHaveBeenCalledWith(401);
			expect(mockService.generateUploadUrl).not.toHaveBeenCalled();
		});

		it("returns 404 when service throws JobNotFoundError", async () => {
			vi.mocked(mockService.generateUploadUrl).mockRejectedValue(
				new JobNotFoundError(),
			);

			const response = makeResponse();
			await controller.getUploadUrl(
				makeRequest({ query: { mimeType: "application/pdf" } }) as never,
				response as never,
				vi.fn(),
			);

			expect(response.status).toHaveBeenCalledWith(404);
		});

		it("returns 502 when service throws S3UploadError", async () => {
			vi.mocked(mockService.generateUploadUrl).mockRejectedValue(
				new S3UploadError(new Error("S3 down")),
			);

			const response = makeResponse();
			await controller.getUploadUrl(
				makeRequest({ query: { mimeType: "application/pdf" } }) as never,
				response as never,
				vi.fn(),
			);

			expect(response.status).toHaveBeenCalledWith(502);
		});

		it("returns 400 when service throws InvalidApplicationPayloadError", async () => {
			vi.mocked(mockService.generateUploadUrl).mockRejectedValue(
				new InvalidApplicationPayloadError(
					"Invalid file type. Allowed types: pdf, doc, docx",
				),
			);

			const response = makeResponse();
			await controller.getUploadUrl(
				makeRequest({ query: { mimeType: "image/png" } }) as never,
				response as never,
				vi.fn(),
			);

			expect(response.status).toHaveBeenCalledWith(400);
			expect(response.status(400).json).toHaveBeenCalledWith({
				message: "Invalid file type. Allowed types: pdf, doc, docx",
			});
		});

		it("calls next for unexpected errors", async () => {
			const unexpectedError = new Error("unexpected");
			vi.mocked(mockService.generateUploadUrl).mockRejectedValue(
				unexpectedError,
			);

			const response = makeResponse();
			const next = vi.fn();

			await controller.getUploadUrl(
				makeRequest({ query: { mimeType: "application/pdf" } }) as never,
				response as never,
				next,
			);

			expect(next).toHaveBeenCalledWith(unexpectedError);
		});
	});

	describe("createApplication", () => {
		it("returns 201 with application on success", async () => {
			const applicationResult = {
				id: 10,
				jobRoleId: 1,
				applicantId: "user-abc",
				status: "in_progress",
				cvFileName: "cv.pdf",
			};
			vi.mocked(mockService.createApplication).mockResolvedValue(
				applicationResult,
			);

			const response = makeResponse();
			const next = vi.fn();

			await controller.createApplication(
				makeRequest() as never,
				response as never,
				next,
			);

			expect(response.status).toHaveBeenCalledWith(201);
			expect(response.status(201).json).toHaveBeenCalledWith(applicationResult);
			expect(next).not.toHaveBeenCalled();
		});

		it("returns 401 when no authenticated user on request", async () => {
			const response = makeResponse();
			const next = vi.fn();

			await controller.createApplication(
				makeRequest({ user: undefined }) as never,
				response as never,
				next,
			);

			expect(response.status).toHaveBeenCalledWith(401);
			expect(mockService.createApplication).not.toHaveBeenCalled();
		});

		it("returns 400 when s3Key is missing from body", async () => {
			const response = makeResponse();
			const next = vi.fn();

			await controller.createApplication(
				makeRequest({
					body: {
						cvFileName: "cv.pdf",
						cvMimeType: "application/pdf",
						cvSizeBytes: 1024,
					},
				}) as never,
				response as never,
				next,
			);

			expect(response.status).toHaveBeenCalledWith(400);
			expect(response.status(400).json).toHaveBeenCalledWith({
				message: "s3Key, cvFileName, cvMimeType and cvSizeBytes are required",
			});
		});

		it("returns 400 when cvFileName is missing from body", async () => {
			const response = makeResponse();

			await controller.createApplication(
				makeRequest({
					body: {
						s3Key: "cvs/1/user/uuid.pdf",
						cvMimeType: "application/pdf",
						cvSizeBytes: 1024,
					},
				}) as never,
				response as never,
				vi.fn(),
			);

			expect(response.status).toHaveBeenCalledWith(400);
		});

		it("returns 400 when cvSizeBytes is missing from body", async () => {
			const response = makeResponse();

			await controller.createApplication(
				makeRequest({
					body: {
						s3Key: "cvs/1/user/uuid.pdf",
						cvFileName: "cv.pdf",
						cvMimeType: "application/pdf",
					},
				}) as never,
				response as never,
				vi.fn(),
			);

			expect(response.status).toHaveBeenCalledWith(400);
		});

		it("calls service with correct params from body", async () => {
			vi.mocked(mockService.createApplication).mockResolvedValue({
				id: 10,
				jobRoleId: 1,
				applicantId: "user-abc",
				status: "in_progress",
				cvFileName: "cv.pdf",
			});

			const response = makeResponse();
			await controller.createApplication(
				makeRequest() as never,
				response as never,
				vi.fn(),
			);

			expect(mockService.createApplication).toHaveBeenCalledWith({
				jobRoleId: 1,
				applicantId: "user-abc",
				s3Key: "cvs/1/user-abc/uuid-cv.pdf",
				cvFileName: "cv.pdf",
				cvMimeType: "application/pdf",
				cvSizeBytes: 1024,
			});
		});

		it("returns 404 when service throws JobNotFoundError", async () => {
			vi.mocked(mockService.createApplication).mockRejectedValue(
				new JobNotFoundError(),
			);

			const response = makeResponse();
			const next = vi.fn();

			await controller.createApplication(
				makeRequest() as never,
				response as never,
				next,
			);

			expect(response.status).toHaveBeenCalledWith(404);
			expect(response.status(404).json).toHaveBeenCalledWith({
				message: "Job role not found",
			});
		});

		it("returns 400 when service throws InvalidApplicationPayloadError", async () => {
			vi.mocked(mockService.createApplication).mockRejectedValue(
				new InvalidApplicationPayloadError(
					"Invalid file type. Allowed types: pdf, doc, docx",
				),
			);

			const response = makeResponse();
			await controller.createApplication(
				makeRequest() as never,
				response as never,
				vi.fn(),
			);

			expect(response.status).toHaveBeenCalledWith(400);
			expect(response.status(400).json).toHaveBeenCalledWith({
				message: "Invalid file type. Allowed types: pdf, doc, docx",
			});
		});

		it("calls next for unexpected errors", async () => {
			const unexpectedError = new Error("unexpected");
			vi.mocked(mockService.createApplication).mockRejectedValue(
				unexpectedError,
			);

			const response = makeResponse();
			const next = vi.fn();

			await controller.createApplication(
				makeRequest() as never,
				response as never,
				next,
			);

			expect(next).toHaveBeenCalledWith(unexpectedError);
		});
	});

	describe("getApplicationForRole", () => {
		it("returns 200 with application when found", async () => {
			const applicationResult = {
				id: 5,
				jobRoleId: 1,
				applicantId: "user-abc",
				status: "in_progress",
				cvFileName: "cv.pdf",
			};
			vi.mocked(mockService.getApplicationForRole).mockResolvedValue(
				applicationResult,
			);

			const response = makeResponse();
			const next = vi.fn();

			await controller.getApplicationForRole(
				makeRequest() as never,
				response as never,
				next,
			);

			expect(response.status).toHaveBeenCalledWith(200);
			expect(response.status(200).json).toHaveBeenCalledWith(applicationResult);
			expect(next).not.toHaveBeenCalled();
		});

		it("returns 404 when no application exists", async () => {
			vi.mocked(mockService.getApplicationForRole).mockResolvedValue(null);

			const response = makeResponse();
			const next = vi.fn();

			await controller.getApplicationForRole(
				makeRequest() as never,
				response as never,
				next,
			);

			expect(response.status).toHaveBeenCalledWith(404);
			expect(response.status(404).json).toHaveBeenCalledWith({
				message: "No application found",
			});
		});

		it("returns 401 when no authenticated user on request", async () => {
			const response = makeResponse();
			const next = vi.fn();

			await controller.getApplicationForRole(
				makeRequest({ user: undefined }) as never,
				response as never,
				next,
			);

			expect(response.status).toHaveBeenCalledWith(401);
			expect(mockService.getApplicationForRole).not.toHaveBeenCalled();
		});

		it("calls next for unexpected errors", async () => {
			const unexpectedError = new Error("db error");
			vi.mocked(mockService.getApplicationForRole).mockRejectedValue(
				unexpectedError,
			);

			const response = makeResponse();
			const next = vi.fn();

			await controller.getApplicationForRole(
				makeRequest() as never,
				response as never,
				next,
			);

			expect(next).toHaveBeenCalledWith(unexpectedError);
		});
	});
});
