import { describe, expect, it, vi } from "vitest";
import { PrismaJobRoleDao } from "../../src/dao/jobRoleDao";
import { JobRoleMapper } from "../../src/mappers/jobRoleMapper";
import type { JobRole } from "../../src/models/jobRole";
import type { JobApplicationService } from "../../src/services/jobApplicationService";
import { JobRoleService } from "../../src/services/jobRoleService";

describe("job role service", () => {
	it("calls default DAO and mapper correctly without userId", async () => {
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

		const mockApplicationService = {
			getApplicationForRole: vi.fn(),
		} as unknown as JobApplicationService;

		const service = new JobRoleService(
			new PrismaJobRoleDao(),
			mockMapper,
			mockApplicationService,
		);

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
			JobRoleDetailedResponse: vi.fn(),
		};
		const mockMapper = new JobRoleMapper();
		const mockApplicationService = {
			getApplicationForRole: vi.fn(),
		} as unknown as JobApplicationService;

		const service = new JobRoleService(
			mockDao,
			mockMapper,
			mockApplicationService,
		);
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
			JobRoleDetailedResponse: vi.fn(),
		};
		const mockMapper = new JobRoleMapper();
		const toResponsesSpy = vi.spyOn(mockMapper, "toResponses");
		const mockApplicationService = {
			getApplicationForRole: vi.fn(),
		} as unknown as JobApplicationService;

		const service = new JobRoleService(
			mockDao,
			mockMapper,
			mockApplicationService,
		);
		const result = await service.getJobRoles();

		expect(toResponsesSpy).toHaveBeenCalledTimes(1);
		expect(toResponsesSpy).toHaveBeenCalledWith([]);
		expect(result).toEqual([]);

		toResponsesSpy.mockRestore();
	});

	it("enriches roles with application status when userId is provided", async () => {
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

		const mockDao = {
			getJobRoles: async () => mockJobRoles,
			JobRoleDetailedResponse: vi.fn(),
		};
		const mockMapper = new JobRoleMapper();
		const toResponsesSpy = vi
			.spyOn(mockMapper, "toResponses")
			.mockReturnValue(mappedResponses);

		const mockApplicationService = {
			getApplicationForRole: vi.fn(async () => ({
				status: "In Progress",
				cvFileName: "cv.pdf",
			})),
		} as unknown as JobApplicationService;

		const service = new JobRoleService(
			mockDao,
			mockMapper,
			mockApplicationService,
		);
		const result = await service.getJobRoles("user-123");

		expect(result).toEqual([
			{
				id: 1,
				roleName: "Backend Engineer",
				location: "Manchester",
				capabilityId: 1,
				bandId: 2,
				closingDate: new Date("2026-08-01T00:00:00.000Z"),
				status: "Open",
				myApplication: {
					status: "In Progress",
					cvFileName: "cv.pdf",
				},
			},
		]);

		expect(mockApplicationService.getApplicationForRole).toHaveBeenCalledWith(
			1,
			"user-123",
		);

		toResponsesSpy.mockRestore();
	});

	it("rethrows DAO errors unchanged", async () => {
		const daoError = new Error("dao failure");
		const mockDao = {
			getJobRoles: async () => {
				throw daoError;
			},
			JobRoleDetailedResponse: vi.fn(),
		};
		const mockApplicationService = {
			getApplicationForRole: vi.fn(),
		} as unknown as JobApplicationService;

		const service = new JobRoleService(
			mockDao,
			new JobRoleMapper(),
			mockApplicationService,
		);

		await expect(service.getJobRoles()).rejects.toBe(daoError);
	});

	describe("JobRoleDetailedResponse", () => {
		it("calls DAO and mapper, returns mapped detailed response without userId", async () => {
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
			const mockApplicationService = {
				getApplicationForRole: vi.fn(),
			} as unknown as JobApplicationService;

			const service = new JobRoleService(
				mockDao,
				mockMapper,
				mockApplicationService,
			);
			const result = await service.JobRoleDetailedResponse(1);

			expect(mockDao.JobRoleDetailedResponse).toHaveBeenCalledWith(1);
			expect(toResponseSpy).toHaveBeenCalledWith(mockJobRole);
			expect(result).toMatchObject({ id: 1, roleName: "Backend Engineer" });
			expect(
				mockApplicationService.getApplicationForRole,
			).not.toHaveBeenCalled();

			toResponseSpy.mockRestore();
		});

		it("enriches detailed response with myApplication when userId is provided", async () => {
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
			const mockApplicationService = {
				getApplicationForRole: vi.fn(async () => ({
					status: "In Progress",
					cvFileName: "cv.pdf",
				})),
			} as unknown as JobApplicationService;

			const service = new JobRoleService(
				mockDao,
				mockMapper,
				mockApplicationService,
			);
			const result = await service.JobRoleDetailedResponse(1, "user-123");

			expect(mockDao.JobRoleDetailedResponse).toHaveBeenCalledWith(1);
			expect(toResponseSpy).toHaveBeenCalledWith(mockJobRole);
			expect(result).toMatchObject({
				id: 1,
				roleName: "Backend Engineer",
				myApplication: {
					status: "In Progress",
					cvFileName: "cv.pdf",
				},
			});
			expect(mockApplicationService.getApplicationForRole).toHaveBeenCalledWith(
				1,
				"user-123",
			);

			toResponseSpy.mockRestore();
		});

		it("returns null when DAO returns null without calling mapper", async () => {
			const mockDao = {
				getJobRoles: vi.fn(),
				JobRoleDetailedResponse: vi.fn(async () => null),
			};
			const mockMapper = new JobRoleMapper();
			const toResponseSpy = vi.spyOn(mockMapper, "JobRoleDetailedResponse");
			const mockApplicationService = {
				getApplicationForRole: vi.fn(),
			} as unknown as JobApplicationService;

			const service = new JobRoleService(
				mockDao,
				mockMapper,
				mockApplicationService,
			);
			const result = await service.JobRoleDetailedResponse(999);

			expect(result).toBeNull();
			expect(toResponseSpy).not.toHaveBeenCalled();
			expect(
				mockApplicationService.getApplicationForRole,
			).not.toHaveBeenCalled();

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
			const mockApplicationService = {
				getApplicationForRole: vi.fn(),
			} as unknown as JobApplicationService;

			const service = new JobRoleService(
				mockDao,
				new JobRoleMapper(),
				mockApplicationService,
			);

			await expect(service.JobRoleDetailedResponse(1)).rejects.toBe(daoError);
		});
	});
});
