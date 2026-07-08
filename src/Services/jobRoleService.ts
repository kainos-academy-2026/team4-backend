import type { JobRoleDaoPort } from "../Dao/jobRoleDao";
import { JobRoleDao } from "../Dao/jobRoleDao";
import { JobRoleMapper } from "../Mappers/JobRoleMapper";
import type { JobRoleResponse } from "../Models/jobRoleResponse";

export class JobRoleService {
	constructor(
		private readonly jobRoleDao: JobRoleDaoPort = new JobRoleDao(),
		private readonly jobRoleMapper: JobRoleMapper = new JobRoleMapper(),
	) {}

	public async getJobRoles(): Promise<JobRoleResponse[]> {
		const jobRoles = await this.jobRoleDao.getJobRoles();

		return this.jobRoleMapper.toResponses(jobRoles);
	}
}
