import { getPrismaClient } from "../prismaClient";
import type { JobRole } from "../Models/jobRole";

export interface JobRoleDao {
	getJobRoles(): Promise<readonly JobRole[]>;
}


export class JobRoleDao implements JobRoleDao {
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