import type { NextFunction, Request, Response } from "express";
import {
	type IJobApplicationRequestMapper,
	JobApplicationRequestMapper,
} from "../mappers/jobApplicationRequestMapper";
import type { JobApplicationService } from "../services/jobApplicationService";
import {
	InvalidApplicationPayloadError,
	JobNotFoundError,
	S3UploadError,
} from "../services/jobApplicationService";

export class JobApplicationController {
	public constructor(
		private readonly jobApplicationService: JobApplicationService,
		private readonly jobApplicationRequestMapper: IJobApplicationRequestMapper = new JobApplicationRequestMapper(),
	) {}

	public getUploadUrl = async (
		request: Request,
		response: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const applicantId = request.user?.userId;
			if (!applicantId) {
				response.status(401).json({ message: "Unauthorised" });
				return;
			}

			const params = this.jobApplicationRequestMapper.toGenerateUploadUrlParams(
				{
					jobRoleIdParam: request.params.id,
					applicantId,
					mimeType: request.query.mimeType,
					fileName: request.query.fileName,
				},
			);

			const result = await this.jobApplicationService.generateUploadUrl(params);

			response.status(200).json(result);
		} catch (error) {
			if (error instanceof InvalidApplicationPayloadError) {
				response.status(400).json({ message: error.message });
				return;
			}

			if (error instanceof JobNotFoundError) {
				response.status(404).json({ message: "Job role not found" });
				return;
			}

			if (error instanceof S3UploadError) {
				response
					.status(502)
					.json({ message: "Failed to generate upload URL, please try again" });
				return;
			}

			next(error);
		}
	};

	public createApplication = async (
		request: Request,
		response: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const applicantId = request.user?.userId;
			if (!applicantId) {
				response.status(401).json({ message: "Unauthorised" });
				return;
			}

			const params = this.jobApplicationRequestMapper.toCreateApplicationParams(
				{
					jobRoleIdParam: request.params.id,
					applicantId,
					s3Key: request.body?.s3Key,
					cvFileName: request.body?.cvFileName,
					cvMimeType: request.body?.cvMimeType,
					cvSizeBytes: request.body?.cvSizeBytes,
				},
			);

			const result = await this.jobApplicationService.createApplication(params);

			response.status(201).json(result);
		} catch (error) {
			if (error instanceof InvalidApplicationPayloadError) {
				response.status(400).json({ message: error.message });
				return;
			}

			if (error instanceof JobNotFoundError) {
				response.status(404).json({ message: "Job role not found" });
				return;
			}

			next(error);
		}
	};

	public getApplicationForRole = async (
		request: Request,
		response: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const jobRoleId = Number(request.params.id);

			const applicantId = request.user?.userId;
			if (!applicantId) {
				response.status(401).json({ message: "Unauthorised" });
				return;
			}

			const application =
				await this.jobApplicationService.getApplicationForRole(
					jobRoleId,
					applicantId,
				);

			if (!application) {
				response.status(404).json({ message: "No application found" });
				return;
			}

			response.status(200).json(application);
		} catch (error) {
			next(error);
		}
	};
}
