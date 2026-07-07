import { describe, expect, it, vi } from "vitest";
import { JobRoleController } from "../../../src/Controller/jobRoleController";
import { JobRoleService } from "../../../src/Services/jobRoleService";

describe("job role controller", () => {
	it("returns status 200 with service payload", async () => {
		const mockedJobRoleResponses = [
			{
				id: 300,
				roleName: "Frontend Engineer",
				location: "Remote",
				capability: "Engineering",
				band: "B2",
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
});
