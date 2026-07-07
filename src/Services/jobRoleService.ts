import { JobRoleMapper } from "../Mappers/JobRoleMapper";
import type { JobRole } from "../Models/jobRole";
import type { JobRoleResponse } from "../Models/jobRoleResponse";

// In-memory schema substitute until a database is introduced.
const jobRoleTable: readonly JobRole[] = [
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
	{
		id: 3,
		roleName: "QA Analyst",
		location: "Remote",
		capability: "Quality",
		band: "B1",
		closingDate: new Date("2026-08-20T00:00:00.000Z"),
		status: "Open",
	},
];

export class JobRoleService {
	public async getJobRoles(): Promise<JobRoleResponse[]> {
		// TODO: Replace this with this.jobRoleRepository.getJobRoles() once the real repository/DB layer is added.
		const jobRoles = jobRoleTable;
		
		return JobRoleMapper.toResponses(jobRoles);
	}
}
