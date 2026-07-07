import type { JobRole } from "../Models/jobRole";
import type { JobRoleResponse } from "../Models/jobRoleResponse";

// In-memory schema substitute until a database is introduced.
const jobRoleTable: readonly JobRole[] = [
	{
		id: "jr-001",
		roleName: "Backend Engineer",
		location: "Manchester",
		capability: "Engineering",
		band: "B2",
		closingDate: new Date("2026-08-01T00:00:00.000Z"),
	},
	{
		id: "jr-002",
		roleName: "Product Designer",
		location: "London",
		capability: "Design",
		band: "B3",
		closingDate: new Date("2026-08-15T00:00:00.000Z"),
	},
	{
		id: "jr-003",
		roleName: "QA Analyst",
		location: "Remote",
		capability: "Quality",
		band: "B1",
		closingDate: new Date("2026-08-20T00:00:00.000Z"),
	},
];

export class JobRoleService {
	public async getJobRoles(): Promise<JobRoleResponse[]> {
		return jobRoleTable.map((jobRole) => ({
			id: jobRole.id,
			roleName: jobRole.roleName,
			location: jobRole.location,
			capability: jobRole.capability,
			band: jobRole.band,
			closingDate: jobRole.closingDate.toISOString(),
		}));
	}
}
