import type { JobRole } from "../Models/jobRole";
import type { JobRoleResponse } from "../Models/jobRoleResponse";

export class JobRoleMapper {
	public static toResponse(jobRole: JobRole): JobRoleResponse {
		return {
			id: jobRole.id,
			roleName: jobRole.roleName,
			location: jobRole.location,
			capability: jobRole.capability,
			band: jobRole.band,
			closingDate: jobRole.closingDate.toISOString(),
			status: jobRole.status,
		};
	}

	public static toResponses(jobRoles: readonly JobRole[]): JobRoleResponse[] {
		return jobRoles.map((jobRole) => this.toResponse(jobRole));
	}
}
