export interface JobRoleDto {
	id: number;
	roleName: string;
	location: string;
	capabilityId: number;
	bandId: number;
	closingDate: Date;
	status: string;
}

export type JobRoleDtoType = JobRoleDto;
