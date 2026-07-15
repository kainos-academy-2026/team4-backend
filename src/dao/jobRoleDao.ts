import type { JobRole } from "../models/jobRole";
import { getPrismaClient } from "../prismaClient";

export interface JobRoleDao {
	getJobRoles(): Promise<readonly JobRole[]>;
	JobRoleDetailedResponse(jobRoleId: number): Promise<JobRole | null>;
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
			id: jobRole.id,
			roleName: jobRole.roleName,
			location: jobRole.location,
			capabilityId: jobRole.capabilityId,
			capabilityName: jobRole.capability.capabilityName,
			bandId: jobRole.bandId,
			bandName: jobRole.band.bandName,
			closingDate:
				jobRole.closingDate instanceof Date
					? jobRole.closingDate
					: new Date(jobRole.closingDate),
			status: jobRole.status,
			description: jobRole.description,
			responsibilities: jobRole.responsibilities,
			sharepointUrl: jobRole.sharepointUrl ?? undefined,
			numberOfOpenPositions: jobRole.numberOfOpenPositions ?? undefined,
		}));
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

		return {
			id: jobRole.id,
			roleName: jobRole.roleName,
			location: jobRole.location,
			capabilityId: jobRole.capabilityId,
			capabilityName: jobRole.capability.capabilityName,
			bandId: jobRole.bandId,
			bandName: jobRole.band.bandName,
			closingDate:
				jobRole.closingDate instanceof Date
					? jobRole.closingDate
					: new Date(jobRole.closingDate),
			status: jobRole.status,
			description: jobRole.description,
			responsibilities: jobRole.responsibilities,
			sharepointUrl: jobRole.sharepointUrl ?? undefined,
			numberOfOpenPositions: jobRole.numberOfOpenPositions ?? undefined,
		};
	}
}
