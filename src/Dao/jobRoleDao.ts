import { jobRoleTable } from "../Dto/jobRoleDto";
import type { JobRole } from "../Models/jobRole";

export interface JobRoleDaoPort {
	getJobRoles(): Promise<readonly JobRole[]>;
}

export class JobRoleDao implements JobRoleDaoPort {
	public async getJobRoles(): Promise<readonly JobRole[]> {
		return jobRoleTable;
	}
}