export type JobRoleDetailedResponse = {
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
	myApplication?: {
		status?: string;
		cvFileName?: string;
	} | null;
};
