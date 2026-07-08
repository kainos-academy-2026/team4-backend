import { describe, expect, it } from "vitest";
import { JobRoleDao } from "../../src/Dao/jobRoleDao";

describe("job role dao", () => {
	it("returns mock job role records", async () => {
		const dao = new JobRoleDao();

		const result = await dao.getJobRoles();

		expect(result).toHaveLength(3);
		expect(result).toContainEqual(
			expect.objectContaining({
				id: 1,
				roleName: "Backend Engineer",
				location: "Manchester",
				capability: "Engineering",
				band: "B2",
				status: "Open",
			}),
		);
		expect(result[0]?.closingDate).toBeInstanceOf(Date);
	});
});
