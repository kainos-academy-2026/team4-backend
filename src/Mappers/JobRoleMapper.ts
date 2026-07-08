import type { JobRole } from "../Models/jobRole";
import type { JobRoleResponse } from "../Models/jobRoleResponse";

export class JobRoleMapper {
	public toResponse(jobRole: JobRole): JobRoleResponse {
		return {
			id: jobRole.id,
			roleName: jobRole.roleName,
			location: jobRole.location,
			capabilityId: jobRole.capabilityId,
			bandId: jobRole.bandId,
			closingDate: jobRole.closingDate.toISOString(),
			status: jobRole.status,
		};
	}

	public toResponses(jobRoles: readonly JobRole[]): JobRoleResponse[] {
		return jobRoles.map((jobRole) => this.toResponse(jobRole));
	}
}
