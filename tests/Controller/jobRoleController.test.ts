import { describe, expect, it, vi } from "vitest";
import { JobRoleController } from "../../src/Controller/jobRoleController";
import type { JobRoleService } from "../../src/Services/jobRoleService";

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

		await controller.getJobRoles({} as never, response as never, next);

		expect(status).toHaveBeenCalledWith(200);
		expect(json).toHaveBeenCalledWith(mockedJobRoleResponses);
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

		await controller.getJobRoles({} as never, response as never, next);

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
			const request = { params: { id: "1" } };

			await controller.JobRoleDetailedResponse(
				request as never,
				response as never,
				next,
			);

			expect(status).toHaveBeenCalledWith(200);
			expect(json).toHaveBeenCalledWith(mockedJobRole);
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
			const request = { params: { id: "999" } };

			await controller.JobRoleDetailedResponse(
				request as never,
				response as never,
				next,
			);

			expect(status).toHaveBeenCalledWith(404);
			expect(json).toHaveBeenCalledWith({ message: "Job role not found" });
			expect(next).not.toHaveBeenCalled();
		});

		it("returns 400 for a non-integer id", async () => {
			const controller = new JobRoleController({
				getJobRoles: vi.fn(),
				JobRoleDetailedResponse: vi.fn(),
			} as unknown as JobRoleService);

			const status = vi.fn(() => response);
			const json = vi.fn();
			const response = { status, json };
			const next = vi.fn();
			const request = { params: { id: "abc" } };

			await controller.JobRoleDetailedResponse(
				request as never,
				response as never,
				next,
			);

			expect(status).toHaveBeenCalledWith(400);
			expect(json).toHaveBeenCalledWith({ message: "Invalid job role id" });
			expect(next).not.toHaveBeenCalled();
		});

		it("returns 400 for a decimal id string", async () => {
			const mockedDetailedResponse = vi.fn();
			const controller = new JobRoleController({
				getJobRoles: vi.fn(),
				JobRoleDetailedResponse: mockedDetailedResponse,
			} as unknown as JobRoleService);

			const status = vi.fn(() => response);
			const json = vi.fn();
			const response = { status, json };
			const next = vi.fn();
			const request = { params: { id: "1.5" } };

			await controller.JobRoleDetailedResponse(
				request as never,
				response as never,
				next,
			);

			expect(status).toHaveBeenCalledWith(400);
			expect(json).toHaveBeenCalledWith({ message: "Invalid job role id" });
			expect(mockedDetailedResponse).not.toHaveBeenCalled();
			expect(next).not.toHaveBeenCalled();
		});

		it("returns 400 for a negative integer id", async () => {
			const mockedDetailedResponse = vi.fn(async () => null);
			const controller = new JobRoleController({
				getJobRoles: vi.fn(),
				JobRoleDetailedResponse: mockedDetailedResponse,
			} as unknown as JobRoleService);

			const status = vi.fn(() => response);
			const json = vi.fn();
			const response = { status, json };
			const next = vi.fn();
			const request = { params: { id: "-1" } };

			await controller.JobRoleDetailedResponse(
				request as never,
				response as never,
				next,
			);

			expect(status).toHaveBeenCalledWith(400);
			expect(json).toHaveBeenCalledWith({ message: "Invalid job role id" });
			expect(mockedDetailedResponse).not.toHaveBeenCalled();
			expect(next).not.toHaveBeenCalled();
		});

		it("returns 400 for zero id", async () => {
			const mockedDetailedResponse = vi.fn(async () => null);
			const controller = new JobRoleController({
				getJobRoles: vi.fn(),
				JobRoleDetailedResponse: mockedDetailedResponse,
			} as unknown as JobRoleService);

			const status = vi.fn(() => response);
			const json = vi.fn();
			const response = { status, json };
			const next = vi.fn();
			const request = { params: { id: "0" } };

			await controller.JobRoleDetailedResponse(
				request as never,
				response as never,
				next,
			);

			expect(status).toHaveBeenCalledWith(400);
			expect(json).toHaveBeenCalledWith({ message: "Invalid job role id" });
			expect(mockedDetailedResponse).not.toHaveBeenCalled();
			expect(next).not.toHaveBeenCalled();
		});

		it("returns 400 for ids outside Number safe integer range", async () => {
			const mockedDetailedResponse = vi.fn(async () => null);
			const controller = new JobRoleController({
				getJobRoles: vi.fn(),
				JobRoleDetailedResponse: mockedDetailedResponse,
			} as unknown as JobRoleService);

			const status = vi.fn(() => response);
			const json = vi.fn();
			const response = { status, json };
			const next = vi.fn();
			const veryLargeId = "9007199254740993";
			const request = { params: { id: veryLargeId } };

			await controller.JobRoleDetailedResponse(
				request as never,
				response as never,
				next,
			);

			expect(status).toHaveBeenCalledWith(400);
			expect(json).toHaveBeenCalledWith({ message: "Invalid job role id" });
			expect(mockedDetailedResponse).not.toHaveBeenCalled();
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
			const request = { params: { id: "1" } };

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
