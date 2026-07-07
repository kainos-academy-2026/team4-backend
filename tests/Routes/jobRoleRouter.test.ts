import { beforeEach, describe, expect, it, vi } from "vitest";

const mockedRouterGet = vi.fn();
const mockedControllerGetJobRoles = vi.fn();
const mockedRouter = {
	get: mockedRouterGet,
};

vi.mock("express", () => ({
	Router: vi.fn(() => mockedRouter),
}));

vi.mock("../../src/Controller/jobRoleController", () => ({
	JobRoleController: vi.fn(function MockedJobRoleController() {
		return {
			getJobRoles: mockedControllerGetJobRoles,
		};
	}),
}));

describe("job role router", () => {
	beforeEach(() => {
		mockedRouterGet.mockClear();
		mockedControllerGetJobRoles.mockClear();
		vi.resetModules();
	});

	it("registers GET /job-roles and delegates to controller", async () => {
		await import("../../src/Routes/jobRoleRouter");

		const jobRolesRouteCall = mockedRouterGet.mock.calls.find(
			(call) => call[0] === "/job-roles",
		);
		expect(jobRolesRouteCall).toBeDefined();

		const jobRolesHandler = jobRolesRouteCall?.[1];
		expect(typeof jobRolesHandler).toBe("function");

		if (!jobRolesHandler) {
			throw new Error("Expected /job-roles route handler");
		}

		const request = {};
		const response = {};
		const next = vi.fn();

		jobRolesHandler(request, response, next);

		expect(mockedControllerGetJobRoles).toHaveBeenCalledWith(
			request,
			response,
			next,
		);
	});

	it("registers GET /health and returns status payload", async () => {
		await import("../../src/Routes/jobRoleRouter");

		const healthRouteCall = mockedRouterGet.mock.calls.find(
			(call) => call[0] === "/health",
		);
		expect(healthRouteCall).toBeDefined();

		const healthHandler = healthRouteCall?.[1];
		expect(typeof healthHandler).toBe("function");

		if (!healthHandler) {
			throw new Error("Expected /health route handler");
		}

		let payload: { status?: string; time?: string } | undefined;
		const response = {
			json: (body: { status?: string; time?: string }) => {
				payload = body;
			},
		};

		healthHandler({}, response);

		expect(payload?.status).toBe("UP");
		expect(payload?.time).toBeTypeOf("string");
		expect(Number.isNaN(Date.parse(payload?.time ?? ""))).toBe(false);
	});
});
