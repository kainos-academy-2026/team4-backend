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

			const file = request.file;
			if (!file) {
				response.status(400).json({ message: "CV file is required" });
				return;
			}

			const result = await this.jobApplicationService.createApplication({
				jobRoleId,
				applicantId,
				cvBuffer: file.buffer,
				cvFileName: file.originalname,
				cvMimeType: file.mimetype,
				cvSizeBytes: file.size,
			});

			response.status(201).json(result);
		} catch (error) {
			if (error instanceof JobNotFoundError) {
				response.status(404).json({ message: "Job role not found" });
				return;
			}

			if (error instanceof S3UploadError) {
				response
					.status(502)
					.json({ message: "Failed to upload CV, please try again" });
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
