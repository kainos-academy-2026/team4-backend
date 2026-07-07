import { describe, expect, it } from "vitest";
import { JobRoleMapper } from "../../../src/Mappers/JobRoleMapper";
import type { JobRole } from "../../../src/Models/jobRole";

describe("job role mapper", () => {
	it("maps a single job role to response format", () => {
		const source: JobRole = {
			id: 99,
			roleName: "Platform Engineer",
			location: "Leeds",
			capability: "Engineering",
			band: "B3",
			closingDate: new Date("2026-10-01T12:00:00.000Z"),
			status: "Open",
		};

		const result = JobRoleMapper.toResponse(source);

		expect(result).toEqual({
			id: 99,
			roleName: "Platform Engineer",
			location: "Leeds",
			capability: "Engineering",
			band: "B3",
			closingDate: "2026-10-01T12:00:00.000Z",
			status: "Open",
		});
	});

	it("maps multiple job roles to response format", () => {
		const source: readonly JobRole[] = [
			{
				id: 1,
				roleName: "Backend Engineer",
				location: "Manchester",
				capability: "Engineering",
				band: "B2",
				closingDate: new Date("2026-08-01T00:00:00.000Z"),
				status: "Open",
			},
			{
				id: 2,
				roleName: "Product Designer",
				location: "London",
				capability: "Design",
				band: "B3",
				closingDate: new Date("2026-08-15T00:00:00.000Z"),
				status: "Open",
			},
		];

		const result = JobRoleMapper.toResponses(source);

		expect(result).toHaveLength(2);
		expect(result[0]?.id).toBe(1);
		expect(result[1]?.id).toBe(2);
		expect(result[0]?.closingDate).toBe("2026-08-01T00:00:00.000Z");
		expect(result[1]?.closingDate).toBe("2026-08-15T00:00:00.000Z");
	});
});
