import { describe, expect, it } from "vitest";
import { jobRoleTable } from "../../src/Dto/jobRoleDto";

describe("job role dto", () => {
	it("contains three predefined job roles with expected ids", () => {
		expect(jobRoleTable).toHaveLength(3);
		expect(jobRoleTable.map((role) => role.id)).toEqual([1, 2, 3]);
	});

	it("uses Date instances for closingDate values", () => {
		for (const jobRole of jobRoleTable) {
			expect(jobRole.closingDate).toBeInstanceOf(Date);
		}

		expect(jobRoleTable.map((role) => role.closingDate.toISOString())).toEqual([
			"2026-08-01T00:00:00.000Z",
			"2026-08-15T00:00:00.000Z",
			"2026-08-20T00:00:00.000Z",
		]);
	});

	it("preserves expected shape and values for each role", () => {
		expect(jobRoleTable[0]).toMatchObject({
			id: 1,
			roleName: "Backend Engineer",
			location: "Manchester",
			capabilityId: 1,
			bandId: 2,
			status: "Open",
		});

		expect(jobRoleTable[1]).toMatchObject({
			id: 2,
			roleName: "Product Designer",
			location: "London",
			capabilityId: 2,
			bandId: 3,
			status: "Open",
		});

		expect(jobRoleTable[2]).toMatchObject({
			id: 3,
			roleName: "QA Analyst",
			location: "Remote",
			capabilityId: 3,
			bandId: 1,
			status: "Open",
		});
	});
});