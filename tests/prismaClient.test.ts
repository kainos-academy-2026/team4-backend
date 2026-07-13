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

	it("passes DATABASE_URL to PrismaClient datasource options", async () => {
		process.env.DATABASE_URL = "postgresql://example-host:5432/team4";
		const { getPrismaClient } = await import("../src/prismaClient");

		getPrismaClient();

		expect(prismaClientCtorMock).toHaveBeenCalledTimes(1);
		expect(prismaClientCtorMock).toHaveBeenCalledWith({
			datasources: {
				db: {
					url: "postgresql://example-host:5432/team4",
				},
			},
		});
	});

	it("trims DATABASE_URL before passing it to PrismaClient", async () => {
		process.env.DATABASE_URL = "  postgresql://trimmed-host:5432/team4  ";
		const { getPrismaClient } = await import("../src/prismaClient");

		getPrismaClient();

		expect(prismaClientCtorMock).toHaveBeenCalledTimes(1);
		expect(prismaClientCtorMock).toHaveBeenCalledWith({
			datasources: {
				db: {
					url: "postgresql://trimmed-host:5432/team4",
				},
			},
		});
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

	it("throws when DATABASE_URL is whitespace-only", async () => {
		process.env.DATABASE_URL = "   ";
		const { getPrismaClient } = await import("../src/prismaClient");

		expect(() => getPrismaClient()).toThrow(
			"DATABASE_URL is required to initialize PrismaClient",
		);
		expect(prismaClientCtorMock).not.toHaveBeenCalled();
	});

	it("rethrows constructor errors and does not cache failed instances", async () => {
		process.env.DATABASE_URL = "postgresql://example";
		const { getPrismaClient } = await import("../src/prismaClient");
		const constructionError = new Error("constructor failed");

		prismaClientCtorMock.mockImplementationOnce(
			function PrismaClientCtorError() {
				throw constructionError;
			},
		);

		expect(() => getPrismaClient()).toThrow(constructionError);
		const secondClient = getPrismaClient();

		expect(prismaClientCtorMock).toHaveBeenCalledTimes(2);
		expect(secondClient).toEqual({ __brand: "prisma" });
	});
});
