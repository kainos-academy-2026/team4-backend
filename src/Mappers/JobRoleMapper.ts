import type { JobRoleDetailedResponse } from "../models/JobRoleDetailedResponse";
import type { JobRole } from "../models/jobRole";
import type { JobRoleResponse } from "../models/jobRoleResponse";

export class JobRoleMapper {
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
