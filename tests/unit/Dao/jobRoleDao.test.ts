import { beforeEach, describe, expect, it, vi } from "vitest";
import { JobRoleDao } from "../../../src/Dao/jobRoleDao";

const findManyMock = vi.hoisted(() => vi.fn());
const getPrismaClientMock = vi.hoisted(() =>
	vi.fn(() => ({
		jobRole: {
			findMany: findManyMock,
		},
	})),
);

vi.mock("../../../src/prismaClient", () => ({
	getPrismaClient: getPrismaClientMock,
}));

describe("job role dao", () => {
	beforeEach(() => {
		findManyMock.mockReset();
		getPrismaClientMock.mockClear();
	});

	it("returns job role records from prisma", async () => {
		const dao = new JobRoleDao();
		findManyMock.mockResolvedValue([
			{
				id: 1,
				roleName: "Backend Engineer",
				location: "Manchester",
				capabilityId: 1,
				bandId: 2,
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
		});
		expect(result).toHaveLength(1);
		expect(result).toContainEqual(
			expect.objectContaining({
				id: 1,
				roleName: "Backend Engineer",
				location: "Manchester",
				capabilityId: 1,
				bandId: 2,
				status: "Open",
			}),
		);
		expect(result[0]?.closingDate).toBeInstanceOf(Date);
	});
});
