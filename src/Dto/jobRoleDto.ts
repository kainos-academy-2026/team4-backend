import type { JobRole } from "../Models/jobRole";

export interface JobRoleDto {
	id: number;
	roleName: string;
	location: string;
	capabilityId: number;
	bandId: number;
	closingDate: string;
	status: string;
}

export type JobRoleDtoType = JobRoleDto;

export const jobRoleTable: readonly JobRole[] = [
	{
		id: 1,
		roleName: "Backend Engineer",
		location: "Manchester",
		capabilityId: 1,
		bandId: 2,
		closingDate: new Date("2026-08-01T00:00:00.000Z"),
		status: "Open",
	},
	{
		id: 2,
		roleName: "Product Designer",
		location: "London",
		capabilityId: 2,
		bandId: 3,
		closingDate: new Date("2026-08-15T00:00:00.000Z"),
		status: "Open",
	},
	{
		id: 3,
		roleName: "QA Analyst",
		location: "Remote",
		capabilityId: 3,
		bandId: 1,
		closingDate: new Date("2026-08-20T00:00:00.000Z"),
		status: "Open",
	},
];
