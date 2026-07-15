import { describe, expect, it } from "vitest";
import { JobRoleMapper } from "../../src/mappers/jobRoleMapper";
import type { JobRole } from "../../src/models/jobRole";

describe("job role mapper", () => {
	it("maps a single job role to response format", () => {
		const source: JobRole = {
			id: 99,
			roleName: "Platform Engineer",
			location: "Leeds",
			capabilityId: 1,
			capabilityName: "Engineering",
			bandId: 3,
			bandName: "Senior",
			closingDate: new Date("2026-10-01T12:00:00.000Z"),
			status: "Open",
		};

		const mapper = new JobRoleMapper();
		const result = mapper.toResponse(source);

		expect(result).toEqual({
			id: 99,
			roleName: "Platform Engineer",
			location: "Leeds",
			capabilityId: 1,
			capabilityName: "Engineering",
			bandId: 3,
			bandName: "Senior",
			closingDate: new Date("2026-10-01T12:00:00.000Z"),
			status: "Open",
		});
	});

	it("maps multiple job roles to response format", () => {
		const source: readonly JobRole[] = [
			{
				id: 1,
				roleName: "Backend Engineer",
				location: "Manchester",
				capabilityId: 1,
				capabilityName: "Engineering",
				bandId: 2,
				bandName: "Associate",
				closingDate: new Date("2026-08-01T00:00:00.000Z"),
				status: "Open",
			},
			{
				id: 2,
				roleName: "Product Designer",
				location: "London",
				capabilityId: 2,
				capabilityName: "Design",
				bandId: 3,
				bandName: "Mid",
				closingDate: new Date("2026-08-15T00:00:00.000Z"),
				status: "Open",
			},
		];

		const mapper = new JobRoleMapper();
		const result = mapper.toResponses(source);

		expect(result).toHaveLength(2);
		expect(result[0]?.id).toBe(1);
		expect(result[1]?.id).toBe(2);
		expect(result[0]?.closingDate).toEqual(
			new Date("2026-08-01T00:00:00.000Z"),
		);
		expect(result[1]?.closingDate).toEqual(
			new Date("2026-08-15T00:00:00.000Z"),
		);
	});

	it("returns an empty array when given no job roles", () => {
		const mapper = new JobRoleMapper();

		expect(mapper.toResponses([])).toEqual([]);
	});
});
