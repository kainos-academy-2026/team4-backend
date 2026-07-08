import type { JobRole } from "../Models/jobRole";
import { getPrismaClient } from "../prismaClient";

export interface JobRoleDaoPort {
	getJobRoles(): Promise<readonly JobRole[]>;
}

export class JobRoleDao implements JobRoleDaoPort {
	public async getJobRoles(): Promise<readonly JobRole[]> {
		const prisma = getPrismaClient();
		const jobRoles = await prisma.jobRole.findMany({
			orderBy: {
				id: "asc",
			},
		});

		return jobRoles.map((jobRole) => ({
			...jobRole,
			closingDate:
				jobRole.closingDate instanceof Date
					? jobRole.closingDate
					: new Date(jobRole.closingDate),
		}));
	}
}
