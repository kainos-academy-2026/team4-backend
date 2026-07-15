import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const mockedListen = vi.fn();
const mockedApp = { listen: mockedListen };
const originalPort = process.env.PORT;

vi.mock("../src/app", () => {
	return {
		default: mockedApp,
	};
});

describe("index route wiring", () => {
	beforeEach(() => {
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
