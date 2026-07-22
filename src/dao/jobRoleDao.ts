import { type IJobRoleMapper, JobRoleMapper } from "../mappers/jobRoleMapper";
import type { JobRole } from "../models/jobRole";
import { getPrismaClient } from "../prismaClient";

export interface JobRoleDao {
	getJobRoles(): Promise<readonly JobRole[]>;
	JobRoleDetailedResponse(jobRoleId: number): Promise<JobRole | null>;
}

export class PrismaJobRoleDao implements JobRoleDao {
	public constructor(
		private readonly jobRoleMapper: IJobRoleMapper = new JobRoleMapper(),
	) {}

	public async getJobRoles(): Promise<readonly JobRole[]> {
		const prisma = getPrismaClient();
		const jobRoles = await prisma.jobRole.findMany({
			orderBy: {
				id: "asc",
			},
			include: {
				capability: true,
				band: true,
			},
		});

		return this.jobRoleMapper.toModels(jobRoles);
	}

	public async JobRoleDetailedResponse(
		jobRoleId: number,
	): Promise<JobRole | null> {
		const prisma = getPrismaClient();
		const jobRole = await prisma.jobRole.findUnique({
			where: {
				id: jobRoleId,
			},
			include: {
				capability: true,
				band: true,
			},
		});

		if (!jobRole) {
			return null;
		}

		return this.jobRoleMapper.toModel(jobRole);
	}
}
