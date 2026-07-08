import { describe, expect, it, vi } from "vitest";
import { JobRoleDao } from "../../src/Dao/jobRoleDao";
import { JobRoleMapper } from "../../src/Mappers/JobRoleMapper";
import { JobRoleService } from "../../src/Services/jobRoleService";
import type { JobRole } from "../../src/Models/jobRole";

describe("job role service", () => {
	it("calls default DAO and mapper correctly", async () => {
		const mockJobRoles: readonly JobRole[] = [
			{
				id: 1,
				roleName: "Backend Engineer",
				location: "Manchester",
				capabilityId: 1,
				bandId: 2,
				closingDate: new Date("2026-08-01T00:00:00.000Z"),
				status: "Open",
			},
		];
		const mappedResponses = [
			{
				id: 1,
				roleName: "Backend Engineer",
				location: "Manchester",
				capabilityId: 1,
				bandId: 2,
				closingDate: "2026-08-01T00:00:00.000Z",
				status: "Open",
			},
		];

		const getJobRolesSpy = vi
			.spyOn(JobRoleDao.prototype, "getJobRoles")
			.mockResolvedValue(mockJobRoles);

		const mockMapper = new JobRoleMapper();
		const toResponsesSpy = vi
			.spyOn(mockMapper, "toResponses")
			.mockReturnValue(mappedResponses);

		const service = new JobRoleService(new JobRoleDao(), mockMapper);

		const result = await service.getJobRoles();

		expect(getJobRolesSpy).toHaveBeenCalledTimes(1);
		expect(toResponsesSpy).toHaveBeenCalledTimes(1);
		expect(toResponsesSpy).toHaveBeenCalledWith(mockJobRoles);
		expect(result).toEqual(mappedResponses);

		getJobRolesSpy.mockRestore();
		toResponsesSpy.mockRestore();
	});

	it("uses injected DAO and maps Date values to ISO strings", async () => {
		const mockJobRoles: readonly JobRole[] = [
			{
				id: 99,
				roleName: "Platform Engineer",
				location: "Leeds",
				capabilityId: 1,
				bandId: 3,
				closingDate: new Date("2026-09-10T00:00:00.000Z"),
				status: "Open",
			},
		];

		const mockDao = {
			getJobRoles: async () => mockJobRoles,
		};
		const mockMapper = new JobRoleMapper();

		const service = new JobRoleService(mockDao, mockMapper);
		const result = await service.getJobRoles();

		expect(result).toEqual([
			{
				id: 99,
				roleName: "Platform Engineer",
				location: "Leeds",
				capabilityId: 1,
				bandId: 3,
				closingDate: "2026-09-10T00:00:00.000Z",
				status: "Open",
			},
		]);
	});
});
