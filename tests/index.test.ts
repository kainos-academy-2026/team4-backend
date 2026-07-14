import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const mockedGet = vi.fn();
const mockedListen = vi.fn();
const mockedDisable = vi.fn();
const mockedUse = vi.fn();
const mockedPost = vi.fn();
const mockedJson = vi.fn(
	() => (_req: unknown, _res: unknown, next: () => void) => next(),
);
const mockedHelmet = vi.fn(
	() => (_req: unknown, _res: unknown, next: () => void) => next(),
);
const mockedAuthRouter = { __type: "auth-router" };
const mockedJobRoleRouter = { __type: "router" };
const mockedExpressRouter = {
	post: mockedPost,
};
const originalPort = process.env.PORT;

vi.mock("express", () => {
	const expressFactory = vi.fn(() => ({
		disable: mockedDisable,
		get: mockedGet,
		use: mockedUse,
		listen: mockedListen,
	}));
	Object.assign(expressFactory, { json: mockedJson });

	return {
		default: expressFactory,
		Router: vi.fn(() => mockedExpressRouter),
	};
});

vi.mock("helmet", () => ({
	default: mockedHelmet,
}));

vi.mock("../src/routes/jobRoleRouter", () => ({
	default: mockedJobRoleRouter,
}));

vi.mock("../src/Routes/auth.routes", () => ({
	authRouter: mockedAuthRouter,
}));

describe("index route wiring", () => {
	beforeEach(() => {
		mockedDisable.mockClear();
		mockedGet.mockClear();
		mockedUse.mockClear();
		mockedPost.mockClear();
		mockedJson.mockClear();
		mockedListen.mockClear();
		vi.resetModules();
		delete process.env.PORT;
	});

	afterAll(() => {
		if (typeof originalPort === "undefined") {
			delete process.env.PORT;
			return;
		}

		process.env.PORT = originalPort;
	});

	it("registers GET /health and returns status UP with parseable time", async () => {
		await import("../src/index.ts");

		expect(mockedGet).toHaveBeenCalledWith("/health", expect.any(Function));
		expect(mockedUse).toHaveBeenCalledWith(expect.any(Function));
		expect(mockedUse).toHaveBeenCalledWith("/auth", mockedAuthRouter);
		expect(mockedUse).toHaveBeenCalledWith(mockedJobRoleRouter);

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

	it("mounts the job role router", async () => {
		await import("../src/index.ts");

		expect(mockedUse).toHaveBeenCalledWith(mockedJobRoleRouter);
	});

	it("starts server on default port 3000 when PORT is not set", async () => {
		await import("../src/index.ts");

		expect(mockedListen).toHaveBeenCalledWith(3000, expect.any(Function));
	});

	it("uses PORT env var when provided", async () => {
		process.env.PORT = "4001";

		await import("../src/index.ts");

		expect(mockedListen).toHaveBeenCalledWith(4001, expect.any(Function));
	});

	it("falls back to default port when PORT is non-numeric", async () => {
		process.env.PORT = "abc";

		await import("../src/index.ts");

		expect(mockedListen).toHaveBeenCalledWith(3000, expect.any(Function));
	});

	it("uses port 0 when PORT is set to 0", async () => {
		process.env.PORT = "0";

		await import("../src/index.ts");

		expect(mockedListen).toHaveBeenCalledWith(0, expect.any(Function));
	});

	it("logs startup message when server starts listening", async () => {
		const mockedConsoleLog = vi
			.spyOn(console, "log")
			.mockImplementation(() => undefined);

		process.env.PORT = "4001";
		await import("../src/index.ts");

		const listenCallback = mockedListen.mock.calls[0]?.[1];
		expect(typeof listenCallback).toBe("function");

		if (!listenCallback) {
			throw new Error("Expected listen callback function");
		}

		listenCallback();

		expect(mockedConsoleLog).toHaveBeenCalledWith("API listening on port 4001");

		mockedConsoleLog.mockRestore();
	});
});
