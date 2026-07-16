import type { JobRoleDao } from "../dao/jobRoleDao";
import { PrismaJobRoleDao } from "../dao/jobRoleDao";
import { type IJobRoleMapper, JobRoleMapper } from "../mappers/jobRoleMapper";
import type { JobRoleDetailedResponse } from "../models/jobRoleDetailedResponse";
import type { JobRoleResponse } from "../models/jobRoleResponse";

export class JobRoleService {
	constructor(
		private readonly jobRoleDao: JobRoleDao = new PrismaJobRoleDao(),
		private readonly jobRoleMapper: IJobRoleMapper = new JobRoleMapper(),
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
