import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const getPrismaClientMock = vi.hoisted(() => vi.fn());

vi.mock("../src/prismaClient", () => ({
	getPrismaClient: getPrismaClientMock,
}));

import { runSeed, seedDatabase } from "../src/seedDatabase";

const originalExitCode = process.exitCode;

const createPrismaStub = () => {
	const capabilityUpsert = vi
		.fn()
		.mockResolvedValueOnce({ id: 11 })
		.mockResolvedValueOnce({ id: 22 })
		.mockResolvedValueOnce({ id: 33 });
	const bandUpsert = vi
		.fn()
		.mockResolvedValueOnce({ id: 101 })
		.mockResolvedValueOnce({ id: 202 })
		.mockResolvedValueOnce({ id: 303 });
	const jobRoleUpsert = vi.fn().mockResolvedValue({ id: 1 });

	return {
		capability: { upsert: capabilityUpsert },
		band: { upsert: bandUpsert },
		jobRole: { upsert: jobRoleUpsert },
		$disconnect: vi.fn(),
	};
};

describe("seedDatabase", () => {
	beforeEach(() => {
		getPrismaClientMock.mockReset();
		vi.restoreAllMocks();
		process.exitCode = originalExitCode;
	});

	afterEach(() => {
		process.exitCode = originalExitCode;
	});

	it("upserts the lookup tables and job roles", async () => {
		const prisma = createPrismaStub();

		const summary = await seedDatabase(prisma);

		expect(prisma.capability.upsert).toHaveBeenCalledTimes(3);
		expect(prisma.band.upsert).toHaveBeenCalledTimes(3);
		expect(prisma.jobRole.upsert).toHaveBeenCalledTimes(3);
		expect(summary).toEqual({ capabilities: 3, bands: 3, jobRoles: 3 });
	});

	it("uses the seeded capability and band ids for job role relationships", async () => {
		const prisma = createPrismaStub();

		await seedDatabase(prisma);

		expect(prisma.jobRole.upsert).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				update: expect.objectContaining({
					capabilityId: 11,
					bandId: 202,
				}),
				create: expect.objectContaining({
					capabilityId: 11,
					bandId: 202,
				}),
			}),
		);

		expect(prisma.jobRole.upsert).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				update: expect.objectContaining({
					capabilityId: 22,
					bandId: 303,
				}),
				create: expect.objectContaining({
					capabilityId: 22,
					bandId: 303,
				}),
			}),
		);

		expect(prisma.jobRole.upsert).toHaveBeenNthCalledWith(
			3,
			expect.objectContaining({
				update: expect.objectContaining({
					capabilityId: 33,
					bandId: 101,
				}),
				create: expect.objectContaining({
					capabilityId: 33,
					bandId: 101,
				}),
			}),
		);
	});

	it("logs a success summary and disconnects the prisma client", async () => {
		const prisma = createPrismaStub();
		const consoleInfoSpy = vi
			.spyOn(console, "info")
			.mockImplementation(() => undefined);

		getPrismaClientMock.mockReturnValue(prisma);

		await runSeed();

		expect(getPrismaClientMock).toHaveBeenCalledTimes(1);
		expect(consoleInfoSpy).toHaveBeenCalledWith(
			"Seeded 3 capabilities, 3 bands, and 3 job roles.",
		);
		expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
		expect(process.exitCode).toBeUndefined();
	});

	it("logs failures, sets a non-zero exit code, and still disconnects", async () => {
		const prisma = createPrismaStub();
		const seedError = new Error("job role insert failed");
		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => undefined);

		prisma.jobRole.upsert.mockRejectedValueOnce(seedError);
		getPrismaClientMock.mockReturnValue(prisma);

		await runSeed();

		expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, "Database seed failed.");
		expect(consoleErrorSpy).toHaveBeenNthCalledWith(2, seedError);
		expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
		expect(process.exitCode).toBe(1);
	});
});
