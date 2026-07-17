import { beforeEach, describe, expect, it, vi } from "vitest";

const mockedRouterGet = vi.fn();
const mockedControllerGetJobRoles = vi.fn();
const mockedControllerJobRoleDetailedResponse = vi.fn();
const mockedAuthorize = vi.fn(() =>
	vi.fn((_request, _response, next) => next()),
);
const mockedRouter = {
	get: mockedRouterGet,
};

vi.mock("express", () => ({
	Router: vi.fn(() => mockedRouter),
}));

vi.mock("../../src/controller/jobRoleController", () => ({
	JobRoleController: vi.fn(function MockedJobRoleController() {
		return {
			getJobRoles: mockedControllerGetJobRoles,
			JobRoleDetailedResponse: mockedControllerJobRoleDetailedResponse,
		};
	}),
}));

vi.mock("../../src/middleware/authMiddleware", () => ({
	authorize: mockedAuthorize,
}));

describe("job role router", () => {
	beforeEach(() => {
		mockedRouterGet.mockClear();
		mockedControllerGetJobRoles.mockClear();
		mockedControllerJobRoleDetailedResponse.mockClear();
		mockedAuthorize.mockClear();
		vi.resetModules();
	});

	it("registers GET /job-roles and delegates to controller", async () => {
		await import("../../src/routes/jobRoleRouter");

		const jobRolesRouteCall = mockedRouterGet.mock.calls.find(
			(call) => call[0] === "/job-roles",
		);
		expect(jobRolesRouteCall).toBeDefined();

		const jobRolesHandler = jobRolesRouteCall?.[2];
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

	it("registers GET /job-roles/:id and delegates to controller", async () => {
		await import("../../src/routes/jobRoleRouter");

		const jobRoleByIdRouteCall = mockedRouterGet.mock.calls.find(
			(call) => call[0] === "/job-roles/:id",
		);
		expect(jobRoleByIdRouteCall).toBeDefined();

		const jobRoleByIdHandler = jobRoleByIdRouteCall?.[2];
		expect(typeof jobRoleByIdHandler).toBe("function");

		if (!jobRoleByIdHandler) {
			throw new Error("Expected /job-roles/:id route handler");
		}

		const request = { params: { id: "1" } };
		const response = {};
		const next = vi.fn();

		jobRoleByIdHandler(request, response, next);

		expect(mockedControllerJobRoleDetailedResponse).toHaveBeenCalledWith(
			request,
			response,
			next,
		);
	});

	it("registers role-based authorization middleware for both routes", async () => {
		await import("../../src/routes/jobRoleRouter");

		expect(mockedAuthorize).toHaveBeenCalledTimes(2);
	});
});
