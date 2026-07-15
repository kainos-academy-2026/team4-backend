import type { JobApplication } from "../models/jobApplication";
import { getPrismaClient } from "../prismaClient";

export interface JobApplicationDao {
	upsert(params: {
		jobRoleId: number;
		applicantId: string;
		status: string;
		cvS3Key: string;
		cvFileName: string;
		cvMimeType: string;
		cvSizeBytes: number;
	}): Promise<JobApplication>;
	findByJobRoleAndApplicant(
		jobRoleId: number,
		applicantId: string,
	): Promise<JobApplication | null>;
}

export class PrismaJobApplicationDao implements JobApplicationDao {
	public async upsert(params: {
		jobRoleId: number;
		applicantId: string;
		status: string;
		cvS3Key: string;
		cvFileName: string;
		cvMimeType: string;
		cvSizeBytes: number;
	}): Promise<JobApplication> {
		const prisma = getPrismaClient();

		const record = await prisma.jobApplication.upsert({
			where: {
				jobRoleId_applicantId: {
					jobRoleId: params.jobRoleId,
					applicantId: params.applicantId,
				},
			},
			update: {
				status: params.status,
				cvS3Key: params.cvS3Key,
				cvFileName: params.cvFileName,
				cvMimeType: params.cvMimeType,
				cvSizeBytes: params.cvSizeBytes,
			},
			create: {
				jobRoleId: params.jobRoleId,
				applicantId: params.applicantId,
				status: params.status,
				cvS3Key: params.cvS3Key,
				cvFileName: params.cvFileName,
				cvMimeType: params.cvMimeType,
				cvSizeBytes: params.cvSizeBytes,
			},
		});

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

	public async findByJobRoleAndApplicant(
		jobRoleId: number,
		applicantId: string,
	): Promise<JobApplication | null> {
		const prisma = getPrismaClient();

		const record = await prisma.jobApplication.findUnique({
			where: {
				jobRoleId_applicantId: { jobRoleId, applicantId },
			},
		});

		if (!record) return null;

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
}
