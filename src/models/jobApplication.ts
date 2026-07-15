export interface JobApplication {
	id: number;
	jobRoleId: number;
	applicantId: string;
	status: string;
	cvS3Key: string;
	cvFileName: string;
	cvMimeType: string;
	cvSizeBytes: number;
	createdAt: Date;
	updatedAt: Date;
}
