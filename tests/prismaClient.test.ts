import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const prismaClientCtorMock = vi.hoisted(() =>
	vi.fn(function PrismaClientMock() {
		return { __brand: "prisma" };
	}),
);
const originalDatabaseUrl = process.env.DATABASE_URL;

vi.mock("@prisma/client", () => ({
	PrismaClient: prismaClientCtorMock,
}));

describe("prisma client", () => {
	beforeEach(() => {
		prismaClientCtorMock.mockClear();
		vi.resetModules();
	});

	afterEach(() => {
		if (typeof originalDatabaseUrl === "undefined") {
			delete process.env.DATABASE_URL;
			return;
		}

		process.env.DATABASE_URL = originalDatabaseUrl;
	});

	it("creates a prisma client once and reuses it on subsequent calls", async () => {
		process.env.DATABASE_URL = "postgresql://example";
		const { getPrismaClient } = await import("../src/prismaClient");

		const firstClient = getPrismaClient();
		const secondClient = getPrismaClient();

		expect(prismaClientCtorMock).toHaveBeenCalledTimes(1);
		expect(secondClient).toBe(firstClient);
	});

	it("throws when DATABASE_URL is missing", async () => {
		delete process.env.DATABASE_URL;
		const { getPrismaClient } = await import("../src/prismaClient");

		expect(() => getPrismaClient()).toThrow(
			"DATABASE_URL is required to initialize PrismaClient",
		);
		expect(prismaClientCtorMock).not.toHaveBeenCalled();
	});

	it("throws when DATABASE_URL is an empty string", async () => {
		process.env.DATABASE_URL = "";
		const { getPrismaClient } = await import("../src/prismaClient");

		expect(() => getPrismaClient()).toThrow(
			"DATABASE_URL is required to initialize PrismaClient",
		);
		expect(prismaClientCtorMock).not.toHaveBeenCalled();
	});
});