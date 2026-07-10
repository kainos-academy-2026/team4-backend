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
			include: {
				capability: true,
				band: true,
			},
		});

		return jobRoles.map((jobRole) => ({
			...jobRole,
			capabilityName: jobRole.capability.capabilityName,
			bandName: jobRole.band.bandName,
			closingDate:
				jobRole.closingDate instanceof Date
					? jobRole.closingDate
					: new Date(jobRole.closingDate),
		}));
	}
}
