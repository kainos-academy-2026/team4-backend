import { describe, expect, it, vi } from "vitest";
import { JobRoleController } from "../../src/controller/jobRoleController";
import type { JobRoleService } from "../../src/services/jobRoleService";

describe("job role controller", () => {
	it("returns status 200 with service payload", async () => {
		const mockedJobRoleResponses = [
			{
				id: 300,
				roleName: "Frontend Engineer",
				location: "Remote",
				capabilityId: 1,
				bandId: 2,
				closingDate: "2026-11-01T00:00:00.000Z",
				status: "Open",
			},
		];

		const mockedGetJobRoles = vi.fn(async () => mockedJobRoleResponses);
		const controller = new JobRoleController({
			getJobRoles: mockedGetJobRoles,
		} as JobRoleService);

		const status = vi.fn(() => response);
		const json = vi.fn();
		const response = { status, json };
		const next = vi.fn();

		await controller.getJobRoles(
			{ user: undefined } as never,
			response as never,
			next,
		);

		expect(status).toHaveBeenCalledWith(200);
		expect(json).toHaveBeenCalledWith(mockedJobRoleResponses);
		expect(mockedGetJobRoles).toHaveBeenCalledWith(undefined);
		expect(next).not.toHaveBeenCalled();
	});

	it("returns status 200 with service payload when authenticated", async () => {
		const mockedJobRoleResponses = [
			{
				id: 300,
				roleName: "Frontend Engineer",
				location: "Remote",
				capabilityId: 1,
				bandId: 2,
				closingDate: "2026-11-01T00:00:00.000Z",
				status: "Open",
				myApplication: {
					status: "In Progress",
					cvFileName: "cv.pdf",
				},
			},
		];

		const mockedGetJobRoles = vi.fn(async () => mockedJobRoleResponses);
		const controller = new JobRoleController({
			getJobRoles: mockedGetJobRoles,
		} as JobRoleService);

		const status = vi.fn(() => response);
		const json = vi.fn();
		const response = { status, json };
		const next = vi.fn();
		const userId = "user-123";

		await controller.getJobRoles(
			{ user: { userId } } as never,
			response as never,
			next,
		);

		expect(status).toHaveBeenCalledWith(200);
		expect(json).toHaveBeenCalledWith(mockedJobRoleResponses);
		expect(mockedGetJobRoles).toHaveBeenCalledWith(userId);
		expect(next).not.toHaveBeenCalled();
	});

	it("passes error to next middleware when service throws", async () => {
		const testError = new Error("Service failed");
		const mockedGetJobRoles = vi.fn(async () => {
			throw testError;
		});
		const controller = new JobRoleController({
			getJobRoles: mockedGetJobRoles,
		} as JobRoleService);

		const status = vi.fn(() => response);
		const json = vi.fn();
		const response = { status, json };
		const next = vi.fn();

		await controller.getJobRoles(
			{ user: undefined } as never,
			response as never,
			next,
		);

		expect(next).toHaveBeenCalledWith(testError);
		expect(status).not.toHaveBeenCalled();
		expect(json).not.toHaveBeenCalled();
	});

	describe("JobRoleDetailedResponse", () => {
		const mockedJobRole = {
			id: 1,
			roleName: "Backend Engineer",
			location: "Manchester",
			capabilityId: 1,
			capabilityName: "Engineering",
			bandId: 2,
			bandName: "B2",
			closingDate: "2026-08-01T00:00:00.000Z",
			status: "Open",
			description: "A backend role",
			responsibilities: "Write code",
		};

		it("returns 200 with job role when found", async () => {
			const mockedDetailedResponse = vi.fn(async () => mockedJobRole);
			const controller = new JobRoleController({
				getJobRoles: vi.fn(),
				JobRoleDetailedResponse: mockedDetailedResponse,
			} as unknown as JobRoleService);

			const status = vi.fn(() => response);
			const json = vi.fn();
			const response = { status, json };
			const next = vi.fn();
			const request = { params: { id: "1" }, user: undefined };

			await controller.JobRoleDetailedResponse(
				request as never,
				response as never,
				next,
			);

			expect(status).toHaveBeenCalledWith(200);
			expect(json).toHaveBeenCalledWith(mockedJobRole);
			expect(mockedDetailedResponse).toHaveBeenCalledWith(1, undefined);
			expect(next).not.toHaveBeenCalled();
		});

		it("returns 200 with job role and myApplication when authenticated", async () => {
			const mockedJobRoleWithApplication = {
				...mockedJobRole,
				myApplication: {
					status: "In Progress",
					cvFileName: "cv.pdf",
				},
			};

			const mockedDetailedResponse = vi.fn(
				async () => mockedJobRoleWithApplication,
			);
			const controller = new JobRoleController({
				getJobRoles: vi.fn(),
				JobRoleDetailedResponse: mockedDetailedResponse,
			} as unknown as JobRoleService);

			const status = vi.fn(() => response);
			const json = vi.fn();
			const response = { status, json };
			const next = vi.fn();
			const userId = "user-123";
			const request = { params: { id: "1" }, user: { userId } };

			await controller.JobRoleDetailedResponse(
				request as never,
				response as never,
				next,
			);

			expect(status).toHaveBeenCalledWith(200);
			expect(json).toHaveBeenCalledWith(mockedJobRoleWithApplication);
			expect(mockedDetailedResponse).toHaveBeenCalledWith(1, userId);
			expect(next).not.toHaveBeenCalled();
		});

		it("returns 404 when service returns null", async () => {
			const mockedDetailedResponse = vi.fn(async () => null);
			const controller = new JobRoleController({
				getJobRoles: vi.fn(),
				JobRoleDetailedResponse: mockedDetailedResponse,
			} as unknown as JobRoleService);

			const status = vi.fn(() => response);
			const json = vi.fn();
			const response = { status, json };
			const next = vi.fn();
			const request = { params: { id: "999" }, user: undefined };

			await controller.JobRoleDetailedResponse(
				request as never,
				response as never,
				next,
			);

			expect(status).toHaveBeenCalledWith(404);
			expect(json).toHaveBeenCalledWith({ message: "Job role not found" });
			expect(next).not.toHaveBeenCalled();
		});

		it("passes error to next middleware when service throws", async () => {
			const testError = new Error("Service failed");
			const mockedDetailedResponse = vi.fn(async () => {
				throw testError;
			});
			const controller = new JobRoleController({
				getJobRoles: vi.fn(),
				JobRoleDetailedResponse: mockedDetailedResponse,
			} as unknown as JobRoleService);

			const status = vi.fn(() => response);
			const json = vi.fn();
			const response = { status, json };
			const next = vi.fn();
			const request = { params: { id: "1" }, user: undefined };

			await controller.JobRoleDetailedResponse(
				request as never,
				response as never,
				next,
			);

			expect(next).toHaveBeenCalledWith(testError);
			expect(status).not.toHaveBeenCalled();
			expect(json).not.toHaveBeenCalled();
		});
	});
});
