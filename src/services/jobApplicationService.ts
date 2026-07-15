import { randomUUID } from "node:crypto";
import { APPLICATION_STATUS } from "../constants/applicationConstants";
import type { JobApplicationDao } from "../dao/jobApplicationDao";
import { PrismaJobApplicationDao } from "../dao/jobApplicationDao";
import type { JobRoleDao } from "../dao/jobRoleDao";
import { PrismaJobRoleDao } from "../dao/jobRoleDao";
import { JobApplicationMapper } from "../mappers/jobApplicationMapper";
import type { JobApplicationResponse } from "../models/jobApplicationResponse";
import { AwsS3Service } from "./s3/awsS3Service";
import type { S3Service } from "./s3/s3Service";

export class JobNotFoundError extends Error {
	constructor() {
		super("Job role not found");
		this.name = "JobNotFoundError";
	}
}

export class S3UploadError extends Error {
	constructor(cause: unknown) {
		super("Failed to upload CV to storage");
		this.name = "S3UploadError";
		this.cause = cause;
	}
}

export class JobApplicationService {
	constructor(
		private readonly jobApplicationDao: JobApplicationDao = new PrismaJobApplicationDao(),
		private readonly jobRoleDao: JobRoleDao = new PrismaJobRoleDao(),
		private readonly s3Service: S3Service = new AwsS3Service(),
		private readonly jobApplicationMapper: JobApplicationMapper = new JobApplicationMapper(),
	) {}

	public async createApplication(params: {
		jobRoleId: number;
		applicantId: string;
		cvBuffer: Buffer;
		cvFileName: string;
		cvMimeType: string;
		cvSizeBytes: number;
	}): Promise<JobApplicationResponse> {
		const jobRole = await this.jobRoleDao.JobRoleDetailedResponse(
			params.jobRoleId,
		);

		if (!jobRole) {
			throw new JobNotFoundError();
		}

		const cvS3Key = `cvs/${params.jobRoleId}/${params.applicantId}/${randomUUID()}-${params.cvFileName}`;

		try {
			await this.s3Service.upload({
				key: cvS3Key,
				body: params.cvBuffer,
				mimeType: params.cvMimeType,
			});
		} catch (error) {
			throw new S3UploadError(error);
		}

		const application = await this.jobApplicationDao.upsert({
			jobRoleId: params.jobRoleId,
			applicantId: params.applicantId,
			status: APPLICATION_STATUS.IN_PROGRESS,
			cvS3Key,
			cvFileName: params.cvFileName,
			cvMimeType: params.cvMimeType,
			cvSizeBytes: params.cvSizeBytes,
		});

		return this.jobApplicationMapper.toResponse(application);
	}

	public async getApplicationForRole(
		jobRoleId: number,
		applicantId: string,
	): Promise<JobApplicationResponse | null> {
		const application = await this.jobApplicationDao.findByJobRoleAndApplicant(
			jobRoleId,
			applicantId,
		);

		if (!application) return null;

		return this.jobApplicationMapper.toResponse(application);
	}
}
