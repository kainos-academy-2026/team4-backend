import type { NextFunction, Request, Response } from "express";
import type { JobApplicationService } from "../services/jobApplicationService";
import {
	InvalidApplicationPayloadError,
	JobNotFoundError,
	S3UploadError,
} from "../services/jobApplicationService";

export class JobApplicationController {
	public constructor(
		private readonly jobApplicationService: JobApplicationService,
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

			const result = await this.jobApplicationService.generateUploadUrl({
				jobRoleIdParam: request.params.id,
				applicantId,
				mimeType: request.query.mimeType,
				fileName: request.query.fileName,
			});

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

			const result = await this.jobApplicationService.createApplication({
				jobRoleIdParam: request.params.id,
				applicantId,
				s3Key: request.body?.s3Key,
				cvFileName: request.body?.cvFileName,
				cvMimeType: request.body?.cvMimeType,
				cvSizeBytes: request.body?.cvSizeBytes,
			});

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
			const applicantId = request.user?.userId;
			if (!applicantId) {
				response.status(401).json({ message: "Unauthorised" });
				return;
			}

			const application =
				await this.jobApplicationService.getApplicationForRole(
					request.params.id,
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
