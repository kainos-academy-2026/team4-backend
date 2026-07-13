import type { JobRoleDao } from "../Dao/jobRoleDao";
import { PrismaJobRoleDao } from "../Dao/jobRoleDao";
import { JobRoleMapper } from "../Mappers/JobRoleMapper";
import type { JobRoleDetailedResponse } from "../Models/JobRoleDetailedResponse";
import type { JobRoleResponse } from "../Models/jobRoleResponse";

export class JobRoleService {
	constructor(
		private readonly jobRoleDao: JobRoleDao = new PrismaJobRoleDao(),
		private readonly jobRoleMapper: JobRoleMapper = new JobRoleMapper(),
	) {}

	public async getJobRoles(): Promise<JobRoleResponse[]> {
		const jobRoles = await this.jobRoleDao.getJobRoles();

		return this.jobRoleMapper.toResponses(jobRoles);
	}

	public async JobRoleDetailedResponse(
		jobRoleId: number,
	): Promise<JobRoleDetailedResponse | null> {
		const jobRole = await this.jobRoleDao.JobRoleDetailedResponse(jobRoleId);

		if (!jobRole) {
			return null;
		}

		return this.jobRoleMapper.JobRoleDetailedResponse(jobRole);
	}
}
