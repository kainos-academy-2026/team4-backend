import { beforeEach, describe, expect, it, vi } from "vitest";

const mockedGet = vi.fn();
const mockedDisable = vi.fn();
const mockedUse = vi.fn();
const mockedJson = vi.fn(() => ({ __type: "jsonMiddleware" }));
const mockedHelmet = vi.fn(() => ({ __type: "helmetMiddleware" }));
const mockedAuthRouter = { __type: "authRouter" };

vi.mock("express", () => {
	const expressFactory = vi.fn(() => ({
		get: mockedGet,
		disable: mockedDisable,
		use: mockedUse,
	}));

	return {
		default: Object.assign(expressFactory, {
			json: mockedJson,
		}),
	};
});

vi.mock("helmet", () => ({
	default: mockedHelmet,
}));

vi.mock("../src/routes/authRoutes", () => ({
	authRouter: mockedAuthRouter,
}));

vi.mock("../src/routes/jobRoleRouter", () => ({
	default: { __type: "jobRoleRouter" },
}));

describe("app wiring", () => {
	beforeEach(() => {
		mockedGet.mockClear();
		mockedDisable.mockClear();
		mockedUse.mockClear();
		mockedJson.mockClear();
		mockedHelmet.mockClear();
		vi.resetModules();
	});

	it("registers middleware and routers in expected order", async () => {
		await import("../src/app");

		expect(mockedDisable).toHaveBeenCalledWith("x-powered-by");
		expect(mockedUse).toHaveBeenNthCalledWith(1, {
			__type: "helmetMiddleware",
		});
		expect(mockedUse).toHaveBeenNthCalledWith(2, { __type: "jsonMiddleware" });
		expect(mockedUse).toHaveBeenNthCalledWith(3, "/auth", mockedAuthRouter);
	});

	it("registers GET /health and returns status UP with parseable time", async () => {
		await import("../src/app");

		const healthCall = mockedGet.mock.calls.find(
			(call) => call[0] === "/health",
		);
		expect(healthCall).toBeDefined();

		const registeredHandler = healthCall?.[1];
		expect(typeof registeredHandler).toBe("function");

		if (!registeredHandler) {
			throw new Error("Expected /health handler function");
		}

		let payload: { status?: string; time?: string } | undefined;
		const response = {
			json: (body: { status?: string; time?: string }) => {
				payload = body;
			},
		};

		registeredHandler({}, response);

		expect(payload?.status).toBe("UP");
		expect(payload?.time).toBeTypeOf("string");
		expect(Number.isNaN(Date.parse(payload?.time ?? ""))).toBe(false);
	});
});
