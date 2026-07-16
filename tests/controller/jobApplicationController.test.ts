import { beforeEach, describe, expect, it, vi } from "vitest";
import { JobApplicationController } from "../../src/controller/jobApplicationController";
import { JobNotFoundError } from "../../src/services/errors/jobNotFoundError";
import { S3UploadError } from "../../src/services/errors/s3UploadError";
import type { JobApplicationService } from "../../src/services/jobApplicationService";

const makeRequest = (overrides: Record<string, unknown> = {}) => ({
	params: { id: "1" },
	user: { userId: "user-abc", email: "test@example.com", role: "user" },
	file: {
		buffer: Buffer.from("pdf content"),
		originalname: "cv.pdf",
		mimetype: "application/pdf",
		size: 1024,
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
} as unknown as JobApplicationService;

describe("JobApplicationController", () => {
	let controller: JobApplicationController;

	beforeEach(() => {
		vi.clearAllMocks();
		controller = new JobApplicationController(mockService);
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

		it("returns 400 when no file is uploaded", async () => {
			const response = makeResponse();
			const next = vi.fn();

			await controller.createApplication(
				makeRequest({ file: undefined }) as never,
				response as never,
				next,
			);

			expect(response.status).toHaveBeenCalledWith(400);
			expect(response.status(400).json).toHaveBeenCalledWith({
				message: "CV file is required",
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

		it("returns 502 when service throws S3UploadError", async () => {
			vi.mocked(mockService.createApplication).mockRejectedValue(
				new S3UploadError(new Error("S3 down")),
			);

			const response = makeResponse();
			const next = vi.fn();

			await controller.createApplication(
				makeRequest() as never,
				response as never,
				next,
			);

			expect(response.status).toHaveBeenCalledWith(502);
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
