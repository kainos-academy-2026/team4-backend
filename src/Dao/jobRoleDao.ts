import type { JobRole } from "../Models/jobRole";
import { getPrismaClient } from "../prismaClient";

export interface JobRoleDao {
	getJobRoles(): Promise<readonly JobRole[]>;
}

export class PrismaJobRoleDao implements JobRoleDao {
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
