import {
	type IJobApplicationMapper,
	JobApplicationMapper,
} from "../mappers/jobApplicationMapper";
import type { JobApplication } from "../models/jobApplication";
import { getPrismaClient } from "../prismaClient";

export interface UpsertJobApplicationParams {
	jobRoleId: number;
	applicantId: string;
	status: string;
	cvS3Key: string;
	cvFileName: string;
	cvMimeType: string;
	cvSizeBytes: number;
}

export interface JobApplicationDao {
	upsert(params: UpsertJobApplicationParams): Promise<JobApplication>;
	findByJobRoleAndApplicant(
		jobRoleId: number,
		applicantId: string,
	): Promise<JobApplication | null>;
}

export class PrismaJobApplicationDao implements JobApplicationDao {
	public constructor(
		private readonly jobApplicationMapper: IJobApplicationMapper = new JobApplicationMapper(),
	) {}

	public async upsert(
		params: UpsertJobApplicationParams,
	): Promise<JobApplication> {
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

		return this.jobApplicationMapper.toModel(record);
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

		return this.jobApplicationMapper.toModel(record);
	}
}
