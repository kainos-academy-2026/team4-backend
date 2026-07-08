import type { JobRole } from "../Models/jobRole";

export interface JobRoleDto {
	id: number;
	roleName: string;
	location: string;
	capability: string;
	band: string;
	closingDate: string;
	status: string;
}

export type JobRoleDtoType = JobRoleDto;

export const jobRoleTable: readonly JobRole[] = [
	{
		id: 1,
		roleName: "Backend Engineer",
		location: "Manchester",
		capability: "Engineering",
		band: "B2",
		closingDate: new Date("2026-08-01T00:00:00.000Z"),
		status: "Open",
	},
	{
		id: 2,
		roleName: "Product Designer",
		location: "London",
		capability: "Design",
		band: "B3",
		closingDate: new Date("2026-08-15T00:00:00.000Z"),
		status: "Open",
	},
	{
		id: 3,
		roleName: "QA Analyst",
		location: "Remote",
		capability: "Quality",
		band: "B1",
		closingDate: new Date("2026-08-20T00:00:00.000Z"),
		status: "Open",
	},
];