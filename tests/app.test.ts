import { beforeEach, describe, expect, it, vi } from "vitest";

const mockedGet = vi.fn();
const mockedUse = vi.fn();
const mockedJson = vi.fn(() => ({ __type: "jsonMiddleware" }));
const mockedHelmet = vi.fn(() => ({ __type: "helmetMiddleware" }));
const mockedAuthorize = vi.fn(() => ({ __type: "authMiddleware" }));
const mockedAuthRouter = { __type: "authRouter" };
const mockedJobRoleRouter = { __type: "jobRoleRouter" };

vi.mock("express", () => {
	const expressFactory = vi.fn(() => ({
		get: mockedGet,
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

vi.mock("../src/Middleware/authMiddleware", () => ({
	authorize: mockedAuthorize,
}));

vi.mock("../src/Routes/authRouter", () => ({
	default: mockedAuthRouter,
}));

vi.mock("../src/Routes/jobRoleRouter", () => ({
	default: mockedJobRoleRouter,
}));

describe("app wiring", () => {
	beforeEach(() => {
		mockedGet.mockClear();
		mockedUse.mockClear();
		mockedJson.mockClear();
		mockedHelmet.mockClear();
		mockedAuthorize.mockClear();
		vi.resetModules();
	});

	it("registers middleware and routers in expected order", async () => {
		await import("../src/app");

		expect(mockedUse).toHaveBeenNthCalledWith(1, {
			__type: "helmetMiddleware",
		});
		expect(mockedUse).toHaveBeenNthCalledWith(2, { __type: "jsonMiddleware" });
		expect(mockedUse).toHaveBeenNthCalledWith(3, mockedAuthRouter);
		expect(mockedUse).toHaveBeenNthCalledWith(4, { __type: "authMiddleware" });
		expect(mockedUse).toHaveBeenNthCalledWith(5, mockedJobRoleRouter);
		expect(mockedAuthorize).toHaveBeenCalledTimes(1);
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
