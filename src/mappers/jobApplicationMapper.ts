import type { JobApplication } from "../models/jobApplication";
import type { JobApplicationResponse } from "../models/jobApplicationResponse";

export type JobApplicationRecord = {
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
};

export interface IJobApplicationMapper {
	toModel(record: JobApplicationRecord): JobApplication;
	toResponse(application: JobApplication): JobApplicationResponse;
}

export class JobApplicationMapper implements IJobApplicationMapper {
	public toModel(record: JobApplicationRecord): JobApplication {
		return {
			id: record.id,
			jobRoleId: record.jobRoleId,
			applicantId: record.applicantId,
			status: record.status,
			cvS3Key: record.cvS3Key,
			cvFileName: record.cvFileName,
			cvMimeType: record.cvMimeType,
			cvSizeBytes: record.cvSizeBytes,
			createdAt: record.createdAt,
			updatedAt: record.updatedAt,
		};
	}

	public toResponse(application: JobApplication): JobApplicationResponse {
		return {
			id: application.id,
			jobRoleId: application.jobRoleId,
			applicantId: application.applicantId,
			status: application.status,
			cvFileName: application.cvFileName,
		};
	}
}
