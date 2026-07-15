import { randomUUID } from "node:crypto";
import { APPLICATION_STATUS } from "../constants/applicationConstants";
import type { JobApplicationDao } from "../dao/jobApplicationDao";
import { PrismaJobApplicationDao } from "../dao/jobApplicationDao";
import type { JobRoleDao } from "../dao/jobRoleDao";
import { PrismaJobRoleDao } from "../dao/jobRoleDao";
import {
	type IJobApplicationMapper,
	JobApplicationMapper,
} from "../mappers/jobApplicationMapper";
import {
	type IJobApplicationRequestMapper,
	JobApplicationRequestMapper,
} from "../mappers/jobApplicationRequestMapper";
import type { JobApplicationResponse } from "../models/jobApplicationResponse";
import { JobNotFoundError } from "./errors/jobNotFoundError";
import { S3UploadError } from "./errors/s3UploadError";
import { AwsS3Service } from "./s3/awsS3Service";
import type { S3Service } from "./s3/s3Service";

export { InvalidApplicationPayloadError } from "./errors/invalidApplicationPayloadError";
export { JobNotFoundError } from "./errors/jobNotFoundError";
export { S3UploadError } from "./errors/s3UploadError";

export interface GenerateUploadUrlParams {
	jobRoleIdParam: unknown;
	applicantId: string;
	mimeType: unknown;
	fileName: unknown;
}

export interface GenerateUploadUrlResult {
	presignedUrl: string;
	s3Key: string;
}

export interface CreateApplicationParams {
	jobRoleIdParam: unknown;
	applicantId: string;
	s3Key: unknown;
	cvFileName: unknown;
	cvMimeType: unknown;
	cvSizeBytes: unknown;
}

export class JobApplicationService {
	constructor(
		private readonly jobApplicationDao: JobApplicationDao = new PrismaJobApplicationDao(),
		private readonly jobRoleDao: JobRoleDao = new PrismaJobRoleDao(),
		private readonly s3Service: S3Service = new AwsS3Service(),
		private readonly jobApplicationMapper: IJobApplicationMapper = new JobApplicationMapper(),
		private readonly jobApplicationRequestMapper: IJobApplicationRequestMapper = new JobApplicationRequestMapper(),
	) {}

	public async generateUploadUrl(
		params: GenerateUploadUrlParams,
	): Promise<GenerateUploadUrlResult> {
		const mappedParams =
			this.jobApplicationRequestMapper.toGenerateUploadUrlParams(params);

		const jobRole = await this.jobRoleDao.JobRoleDetailedResponse(
			mappedParams.jobRoleId,
		);

		if (!jobRole) {
			throw new JobNotFoundError();
		}

		const fileName = mappedParams.fileName ?? `${randomUUID()}.bin`;
		const s3Key = `cvs/${mappedParams.jobRoleId}/${mappedParams.applicantId}/${randomUUID()}-${fileName}`;

		let presignedUrl: string;
		try {
			presignedUrl = await this.s3Service.getPresignedPutUrl({
				key: s3Key,
				mimeType: mappedParams.mimeType,
			});
		} catch (error) {
			throw new S3UploadError(error);
		}

		return { presignedUrl, s3Key };
	}

	public async createApplication(
		params: CreateApplicationParams,
	): Promise<JobApplicationResponse> {
		const mappedParams =
			this.jobApplicationRequestMapper.toCreateApplicationParams(params);

		const jobRole = await this.jobRoleDao.JobRoleDetailedResponse(
			mappedParams.jobRoleId,
		);

		if (!jobRole) {
			throw new JobNotFoundError();
		}

		const application = await this.jobApplicationDao.upsert({
			jobRoleId: mappedParams.jobRoleId,
			applicantId: mappedParams.applicantId,
			status: APPLICATION_STATUS.IN_PROGRESS,
			cvS3Key: mappedParams.s3Key,
			cvFileName: mappedParams.cvFileName,
			cvMimeType: mappedParams.cvMimeType,
			cvSizeBytes: mappedParams.cvSizeBytes,
		});

		return this.jobApplicationMapper.toResponse(application);
	}

	public async getApplicationForRole(
		jobRoleIdParam: unknown,
		applicantId: string,
	): Promise<JobApplicationResponse | null> {
		const mappedParams =
			this.jobApplicationRequestMapper.toGetApplicationForRoleParams({
				jobRoleIdParam,
				applicantId,
			});

		const application = await this.jobApplicationDao.findByJobRoleAndApplicant(
			mappedParams.jobRoleId,
			mappedParams.applicantId,
		);

		if (!application) return null;

		return this.jobApplicationMapper.toResponse(application);
	}
}
