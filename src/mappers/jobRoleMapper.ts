import type { JobRole } from "../models/jobRole";
import type { JobRoleDetailedResponse } from "../models/jobRoleDetailedResponse";
import type { JobRoleResponse } from "../models/jobRoleResponse";

type JobRoleRecord = {
	id: number;
	roleName: string;
	location: string;
	capabilityId: number;
	capability: {
		capabilityName: string;
	};
	bandId: number;
	band: {
		bandName: string;
	};
	closingDate: Date | string;
	status: string;
	description: string;
	responsibilities: string;
	sharepointUrl?: string | null;
	numberOfOpenPositions?: number | null;
};

export class JobRoleMapper {
	public toModel(record: JobRoleRecord): JobRole {
		return {
			id: record.id,
			roleName: record.roleName,
			location: record.location,
			capabilityId: record.capabilityId,
			capabilityName: record.capability.capabilityName,
			bandId: record.bandId,
			bandName: record.band.bandName,
			closingDate:
				record.closingDate instanceof Date
					? record.closingDate
					: new Date(record.closingDate),
			status: record.status,
			description: record.description,
			responsibilities: record.responsibilities,
			sharepointUrl: record.sharepointUrl ?? undefined,
			numberOfOpenPositions: record.numberOfOpenPositions ?? undefined,
		};
	}

	public toModels(records: readonly JobRoleRecord[]): JobRole[] {
		return records.map((record) => this.toModel(record));
	}

	public toResponse(jobRole: JobRole): JobRoleResponse {
		return {
			id: jobRole.id,
			roleName: jobRole.roleName,
			location: jobRole.location,
			capabilityId: jobRole.capabilityId,
			capabilityName: jobRole.capabilityName,
			bandId: jobRole.bandId,
			bandName: jobRole.bandName,
			closingDate: jobRole.closingDate,
			status: jobRole.status,
		};
	}
	public JobRoleDetailedResponse(jobRole: JobRole): JobRoleDetailedResponse {
		return {
			id: jobRole.id,
			roleName: jobRole.roleName,
			location: jobRole.location,
			capabilityId: jobRole.capabilityId,
			capabilityName: jobRole.capabilityName,
			bandId: jobRole.bandId,
			bandName: jobRole.bandName,
			closingDate: jobRole.closingDate,
			status: jobRole.status,
			description: jobRole.description,
			responsibilities: jobRole.responsibilities,
			sharepointUrl: jobRole.sharepointUrl,
			numberOfOpenPositions: jobRole.numberOfOpenPositions,
		};
	}

	public toResponses(jobRoles: readonly JobRole[]): JobRoleResponse[] {
		return jobRoles.map((jobRole) => this.toResponse(jobRole));
	}
}
