import { describe, expect, it, vi } from "vitest";
import { PrismaJobRoleDao } from "../../src/Dao/jobRoleDao";
import { JobRoleMapper } from "../../src/Mappers/JobRoleMapper";
import type { JobRole } from "../../src/Models/jobRole";
import { JobRoleService } from "../../src/Services/jobRoleService";

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
				closingDate: new Date("2026-08-01T00:00:00.000Z"),
				status: "Open",
			},
		];

		const getJobRolesSpy = vi
			.spyOn(PrismaJobRoleDao.prototype, "getJobRoles")
			.mockResolvedValue(mockJobRoles);

		const mockMapper = new JobRoleMapper();
		const toResponsesSpy = vi
			.spyOn(mockMapper, "toResponses")
			.mockReturnValue(mappedResponses);

		const service = new JobRoleService(new PrismaJobRoleDao(), mockMapper);

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
				closingDate: new Date("2026-09-10T00:00:00.000Z"),
				status: "Open",
			},
		]);
	});

	it("returns an empty array when DAO returns no roles", async () => {
		const mockDao = {
			getJobRoles: async () => [],
		};
		const mockMapper = new JobRoleMapper();
		const toResponsesSpy = vi.spyOn(mockMapper, "toResponses");

		const service = new JobRoleService(mockDao, mockMapper);
		const result = await service.getJobRoles();

		expect(toResponsesSpy).toHaveBeenCalledTimes(1);
		expect(toResponsesSpy).toHaveBeenCalledWith([]);
		expect(result).toEqual([]);

		toResponsesSpy.mockRestore();
	});

	it("rethrows DAO errors unchanged", async () => {
		const daoError = new Error("dao failure");
		const mockDao = {
			getJobRoles: async () => {
				throw daoError;
			},
		};

		const service = new JobRoleService(mockDao, new JobRoleMapper());

		await expect(service.getJobRoles()).rejects.toBe(daoError);
	});

	describe("JobRoleDetailedResponse", () => {
		it("calls DAO and mapper, returns mapped detailed response", async () => {
			const mockJobRole: JobRole = {
				id: 1,
				roleName: "Backend Engineer",
				location: "Manchester",
				capabilityId: 1,
				capabilityName: "Engineering",
				bandId: 2,
				bandName: "B2",
				closingDate: new Date("2026-08-01T00:00:00.000Z"),
				status: "Open",
				description: "A backend role",
				responsibilities: "Write code",
			};

			const mockDao = {
				getJobRoles: vi.fn(),
				JobRoleDetailedResponse: vi.fn(async () => mockJobRole),
			};
			const mockMapper = new JobRoleMapper();
			const toResponseSpy = vi.spyOn(mockMapper, "JobRoleDetailedResponse");

			const service = new JobRoleService(mockDao, mockMapper);
			const result = await service.JobRoleDetailedResponse(1);

			expect(mockDao.JobRoleDetailedResponse).toHaveBeenCalledWith(1);
			expect(toResponseSpy).toHaveBeenCalledWith(mockJobRole);
			expect(result).toMatchObject({ id: 1, roleName: "Backend Engineer" });

			toResponseSpy.mockRestore();
		});

		it("returns null when DAO returns null without calling mapper", async () => {
			const mockDao = {
				getJobRoles: vi.fn(),
				JobRoleDetailedResponse: vi.fn(async () => null),
			};
			const mockMapper = new JobRoleMapper();
			const toResponseSpy = vi.spyOn(mockMapper, "JobRoleDetailedResponse");

			const service = new JobRoleService(mockDao, mockMapper);
			const result = await service.JobRoleDetailedResponse(999);

			expect(result).toBeNull();
			expect(toResponseSpy).not.toHaveBeenCalled();

			toResponseSpy.mockRestore();
		});

		it("rethrows DAO errors unchanged", async () => {
			const daoError = new Error("dao failure");
			const mockDao = {
				getJobRoles: vi.fn(),
				JobRoleDetailedResponse: vi.fn(async () => {
					throw daoError;
				}),
			};

			const service = new JobRoleService(mockDao, new JobRoleMapper());

			await expect(service.JobRoleDetailedResponse(1)).rejects.toBe(daoError);
		});
	});
});
