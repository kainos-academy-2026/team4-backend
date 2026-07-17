import type { NextFunction, Request, Response } from "express";
import type { JobApplicationService } from "../services/jobApplicationService";
import {
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
			const jobRoleId = Number(request.params.id);

			const applicantId = request.user?.userId;
			if (!applicantId) {
				response.status(401).json({ message: "Unauthorised" });
				return;
			}

			const fileName = request.query.fileName as string | undefined;

			const result = await this.jobApplicationService.generateUploadUrl({
				jobRoleId,
				applicantId,
				fileName,
			});

			response.status(200).json(result);
		} catch (error) {
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
			const jobRoleId = Number(request.params.id);

			const applicantId = request.user?.userId;
			if (!applicantId) {
				response.status(401).json({ message: "Unauthorised" });
				return;
			}

			const { s3Key, cvFileName, cvMimeType, cvSizeBytes } = request.body as {
				s3Key?: string;
				cvFileName?: string;
				cvMimeType?: string;
				cvSizeBytes?: number;
			};

			if (!s3Key || !cvFileName || !cvMimeType || cvSizeBytes === undefined) {
				response.status(400).json({
					message: "s3Key, cvFileName, cvMimeType and cvSizeBytes are required",
				});
				return;
			}

			const result = await this.jobApplicationService.createApplication({
				jobRoleId,
				applicantId,
				s3Key,
				cvFileName,
				cvMimeType,
				cvSizeBytes,
			});

			response.status(201).json(result);
		} catch (error) {
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
