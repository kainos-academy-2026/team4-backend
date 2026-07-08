import { describe, expect, it } from "vitest";
import { JobRoleService } from "../../../src/Services/jobRoleService";
import type { JobRole } from "../../../src/Models/jobRole";

describe("job role service", () => {
	it("returns job role responses from default in-memory DAO", async () => {
		const service = new JobRoleService();

		const result = await service.getJobRoles();

		expect(result).toHaveLength(3);
		expect(result).toContainEqual(
			expect.objectContaining({
				id: 1,
				roleName: "Backend Engineer",
				location: "Manchester",
				capability: "Engineering",
				band: "B2",
				closingDate: "2026-08-01T00:00:00.000Z",
				status: "Open",
			}),
		);
	});

	it("uses injected DAO and maps Date values to ISO strings", async () => {
		const mockJobRoles: readonly JobRole[] = [
			{
				id: 99,
				roleName: "Platform Engineer",
				location: "Leeds",
				capability: "Engineering",
				band: "B3",
				closingDate: new Date("2026-09-10T00:00:00.000Z"),
				status: "Open",
			},
		];

		const mockDao = {
			getJobRoles: async () => mockJobRoles,
		};

		const service = new JobRoleService(mockDao);
		const result = await service.getJobRoles();

		expect(result).toEqual([
			{
				id: 99,
				roleName: "Platform Engineer",
				location: "Leeds",
				capability: "Engineering",
				band: "B3",
				closingDate: "2026-09-10T00:00:00.000Z",
				status: "Open",
			},
		]);
	});
});
