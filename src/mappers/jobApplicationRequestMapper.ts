import {
	type CreateApplicationInputDto,
	CreateApplicationInputSchema,
	type GenerateUploadUrlInputDto,
	GenerateUploadUrlInputSchema,
	type GetApplicationForRoleInputDto,
	GetApplicationForRoleInputSchema,
} from "../dto/jobApplicationDto";
import { InvalidApplicationPayloadError } from "../services/errors/invalidApplicationPayloadError";

export interface GenerateUploadUrlRequestInput {
	jobRoleIdParam: unknown;
	applicantId: string;
	mimeType: unknown;
	fileName: unknown;
}

export interface CreateApplicationRequestInput {
	jobRoleIdParam: unknown;
	applicantId: string;
	s3Key: unknown;
	cvFileName: unknown;
	cvMimeType: unknown;
	cvSizeBytes: unknown;
}

export interface GetApplicationForRoleRequestInput {
	jobRoleIdParam: unknown;
	applicantId: string;
}

export interface IJobApplicationRequestMapper {
	toGenerateUploadUrlParams(
		input: GenerateUploadUrlRequestInput,
	): GenerateUploadUrlInputDto;
	toCreateApplicationParams(
		input: CreateApplicationRequestInput,
	): CreateApplicationInputDto;
	toGetApplicationForRoleParams(
		input: GetApplicationForRoleRequestInput,
	): GetApplicationForRoleInputDto;
}

export class JobApplicationRequestMapper
	implements IJobApplicationRequestMapper
{
	public toGenerateUploadUrlParams(
		input: GenerateUploadUrlRequestInput,
	): GenerateUploadUrlInputDto {
		const parsed = GenerateUploadUrlInputSchema.safeParse({
			jobRoleId: input.jobRoleIdParam,
			applicantId: input.applicantId,
			mimeType: input.mimeType,
			fileName: input.fileName,
		});

		if (!parsed.success) {
			const firstIssue = parsed.error.issues[0];
			throw new InvalidApplicationPayloadError(
				firstIssue?.message ?? "Invalid application payload",
			);
		}

		return parsed.data;
	}

	public toCreateApplicationParams(
		input: CreateApplicationRequestInput,
	): CreateApplicationInputDto {
		const parsed = CreateApplicationInputSchema.safeParse({
			jobRoleId: input.jobRoleIdParam,
			applicantId: input.applicantId,
			s3Key: input.s3Key,
			cvFileName: input.cvFileName,
			cvMimeType: input.cvMimeType,
			cvSizeBytes: input.cvSizeBytes,
		});

		if (!parsed.success) {
			const missingRequiredField = parsed.error.issues.find(
				(issue) =>
					issue.code === "invalid_type" &&
					(issue.path[0] === "s3Key" ||
						issue.path[0] === "cvFileName" ||
						issue.path[0] === "cvMimeType" ||
						issue.path[0] === "cvSizeBytes"),
			);

			if (missingRequiredField) {
				throw new InvalidApplicationPayloadError(
					"s3Key, cvFileName, cvMimeType and cvSizeBytes are required",
				);
			}

			const firstIssue = parsed.error.issues[0];
			throw new InvalidApplicationPayloadError(
				firstIssue?.message ?? "Invalid application payload",
			);
		}

		return parsed.data;
	}

	public toGetApplicationForRoleParams(
		input: GetApplicationForRoleRequestInput,
	): GetApplicationForRoleInputDto {
		const parsed = GetApplicationForRoleInputSchema.safeParse({
			jobRoleId: input.jobRoleIdParam,
			applicantId: input.applicantId,
		});

		if (!parsed.success) {
			const firstIssue = parsed.error.issues[0];
			throw new InvalidApplicationPayloadError(
				firstIssue?.message ?? "Invalid application payload",
			);
		}

		return parsed.data;
	}
}
