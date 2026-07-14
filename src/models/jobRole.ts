export type JobRole = {
	id: number;
	roleName: string;
	location: string;
	capabilityId: number;
	capabilityName: string;
	bandId: number;
	bandName: string;
	closingDate: Date;
	status: string;
	description: string;
	responsibilities: string;
	sharepointUrl?: string;
	numberOfOpenPositions?: number;
};
