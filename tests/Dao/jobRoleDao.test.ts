import { beforeEach, describe, expect, it, vi } from "vitest";
import { PrismaJobRoleDao } from "../../src/Dao/jobRoleDao";

const findManyMock = vi.hoisted(() => vi.fn());
const getPrismaClientMock = vi.hoisted(() =>
	vi.fn(() => ({
		jobRole: {
			findMany: findManyMock,
		},
	})),
);

vi.mock("../../src/prismaClient", () => ({
	getPrismaClient: getPrismaClientMock,
}));

describe("job role dao", () => {
	beforeEach(() => {
		findManyMock.mockReset();
		getPrismaClientMock.mockClear();
	});

	it("returns job role records from prisma", async () => {
		const dao = new PrismaJobRoleDao();
		findManyMock.mockResolvedValue([
			{
				id: 1,
				roleName: "Backend Engineer",
				location: "Manchester",
				capabilityId: 1,
				capability: { id: 1, capabilityName: "Engineering" },
				bandId: 2,
				band: { id: 2, bandName: "Associate" },
				closingDate: new Date("2026-08-01T00:00:00.000Z"),
				status: "Open",
			},
		]);

		const result = await dao.getJobRoles();

		expect(getPrismaClientMock).toHaveBeenCalledTimes(1);
		expect(findManyMock).toHaveBeenCalledWith({
			orderBy: {
				id: "asc",
			},
			include: {
				capability: true,
				band: true,
			},
		});
		expect(result).toHaveLength(1);
		expect(result).toContainEqual(
			expect.objectContaining({
				id: 1,
				roleName: "Backend Engineer",
				location: "Manchester",
				capabilityId: 1,
				capabilityName: "Engineering",
				bandId: 2,
				bandName: "Associate",
				status: "Open",
			}),
		);
		expect(result[0]?.closingDate).toBeInstanceOf(Date);
	});

	it("converts closingDate string values to Date", async () => {
		const dao = new PrismaJobRoleDao();
		findManyMock.mockResolvedValue([
			{
				id: 2,
				roleName: "Frontend Engineer",
				location: "London",
				capabilityId: 3,
				capability: { id: 3, capabilityName: "Design" },
				bandId: 4,
				band: { id: 4, bandName: "Senior" },
				closingDate: "2026-09-15T10:30:00.000Z",
				status: "Open",
			},
		]);

		const result = await dao.getJobRoles();

		expect(result).toHaveLength(1);
		expect(result[0]?.closingDate).toBeInstanceOf(Date);
		expect(result[0]?.closingDate.toISOString()).toBe(
			"2026-09-15T10:30:00.000Z",
		);
	});

	it("keeps Date closingDate values unchanged by timestamp", async () => {
		const dao = new PrismaJobRoleDao();
		const originalClosingDate = new Date("2026-10-01T12:00:00.000Z");
		findManyMock.mockResolvedValue([
			{
				id: 3,
				roleName: "QA Engineer",
				location: "Bristol",
				capabilityId: 5,
				capability: { id: 5, capabilityName: "Quality" },
				bandId: 1,
				band: { id: 1, bandName: "Trainee" },
				closingDate: originalClosingDate,
				status: "Closed",
			},
		]);

		const result = await dao.getJobRoles();

		expect(result[0]?.closingDate).toBeInstanceOf(Date);
		expect(result[0]?.closingDate.toISOString()).toBe(
			originalClosingDate.toISOString(),
		);
	});

	it("returns an empty array when prisma returns no job roles", async () => {
		const dao = new PrismaJobRoleDao();
		findManyMock.mockResolvedValue([]);

		const result = await dao.getJobRoles();

		expect(result).toEqual([]);
		expect(findManyMock).toHaveBeenCalledWith({
			orderBy: {
				id: "asc",
			},
			include: {
				capability: true,
				band: true,
			},
		});
	});

	it("maps multiple records and preserves non-date fields", async () => {
		const dao = new PrismaJobRoleDao();
		findManyMock.mockResolvedValue([
			{
				id: 4,
				roleName: "Platform Engineer",
				location: "Leeds",
				capabilityId: 2,
				capability: { id: 2, capabilityName: "Engineering" },
				bandId: 3,
				band: { id: 3, bandName: "Mid" },
				closingDate: "2026-11-20T00:00:00.000Z",
				status: "Open",
			},
			{
				id: 5,
				roleName: "DevOps Engineer",
				location: "Remote",
				capabilityId: 2,
				capability: { id: 2, capabilityName: "Engineering" },
				bandId: 4,
				band: { id: 4, bandName: "Senior" },
				closingDate: new Date("2026-12-01T00:00:00.000Z"),
				status: "Open",
			},
		]);

		const result = await dao.getJobRoles();

		expect(result).toHaveLength(2);
		expect(result[0]).toMatchObject({
			id: 4,
			roleName: "Platform Engineer",
			location: "Leeds",
			capabilityId: 2,
			bandId: 3,
			status: "Open",
		});
		expect(result[1]).toMatchObject({
			id: 5,
			roleName: "DevOps Engineer",
			location: "Remote",
			capabilityId: 2,
			bandId: 4,
			status: "Open",
		});
		expect(result[0]?.closingDate).toBeInstanceOf(Date);
		expect(result[1]?.closingDate).toBeInstanceOf(Date);
		expect(result[0]?.closingDate.toISOString()).toBe(
			"2026-11-20T00:00:00.000Z",
		);
		expect(result[1]?.closingDate.toISOString()).toBe(
			"2026-12-01T00:00:00.000Z",
		);
	});

	it("rethrows errors when prisma findMany fails", async () => {
		const dao = new PrismaJobRoleDao();
		const prismaError = new Error("db unavailable");
		findManyMock.mockRejectedValue(prismaError);

		await expect(dao.getJobRoles()).rejects.toThrow("db unavailable");
	});
});
