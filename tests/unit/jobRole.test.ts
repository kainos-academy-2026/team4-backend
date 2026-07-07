import { describe, expect, it, vi } from "vitest";
import { JobRoleController } from "../../src/Controller/jobRoleController";
import { registerJobRoleRoutes } from "../../src/Routes/jobRoleRouter";
import { JobRoleService } from "../../src/Services/jobRoleService";

describe("job role service", () => {
	it("returns job role responses from in-memory schema", async () => {
		const service = new JobRoleService();

		const result = await service.getJobRoles();

		expect(result).toHaveLength(3);
		expect(result).toContainEqual(
			expect.objectContaining({
				id: "jr-001",
				roleName: "Backend Engineer",
				location: "Manchester",
				capability: "Engineering",
				band: "B2",
				closingDate: "2026-08-01T00:00:00.000Z",
				status: "Open",
			}),
		);
	});
});

describe("job role controller", () => {
	it("returns status 200 with service payload", async () => {
		const mockedJobRoleResponses = [
			{
				id: "jr-300",
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

describe("job role router", () => {
	it("registers GET /job-roles and returns a list payload", async () => {
		const mockedGet = vi.fn();
		const app = {
			get: mockedGet,
		};

		registerJobRoleRoutes(app as never);

		expect(mockedGet).toHaveBeenCalledWith("/job-roles", expect.any(Function));

		const routeHandler = mockedGet.mock.calls[0]?.[1];
		expect(typeof routeHandler).toBe("function");

		if (!routeHandler) {
			throw new Error("Expected /job-roles route handler");
		}

		let responseStatus: number | undefined;
		let responseBody: unknown;
		const response = {
			status: (statusCode: number) => {
				responseStatus = statusCode;
				return response;
			},
			json: (body: unknown) => {
				responseBody = body;
			},
		};

		await routeHandler({}, response, vi.fn());

		expect(responseStatus).toBe(200);
		expect(Array.isArray(responseBody)).toBe(true);
		expect(responseBody).not.toHaveLength(0);
		expect(responseBody).toContainEqual(
			expect.objectContaining({
				id: expect.any(String),
				roleName: expect.any(String),
				location: expect.any(String),
				capability: expect.any(String),
				band: expect.any(String),
				closingDate: expect.any(String),
				status: expect.any(String),
			}),
		);
	});
});

describe("index.ts route registration", () => {
	it("Initialises the listening server on the configured port", async () => {
		const mockedListen = vi.fn();
		const mockedGet = vi.fn();
		const mockedDisable = vi.fn();
		const mockedConsoleLog = vi
			.spyOn(console, "log")
			.mockImplementation(() => undefined);

		vi.stubEnv("PORT", "4000");
		vi.doMock("express", () => {
			return {
				default: () => ({
					listen: mockedListen,
					get: mockedGet,
					disable: mockedDisable,
				}),
			};
		});

		await import("../../src/index.ts");

		const listenCallback = mockedListen.mock.calls[0]?.[1];
		if (typeof listenCallback === "function") {
			listenCallback();
		}

		expect(mockedDisable).toHaveBeenCalledWith("x-powered-by");
		expect(mockedGet).toHaveBeenCalledWith("/health", expect.any(Function));
		expect(mockedListen).toHaveBeenCalledWith(4000, expect.any(Function));
		expect(mockedConsoleLog).toHaveBeenCalledWith("API listening on port 4000");

		vi.unstubAllEnvs();
		mockedConsoleLog.mockRestore();
	});
});
