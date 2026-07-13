import type { NextFunction, Request, Response } from "express";
import type { JobRoleService } from "../Services/jobRoleService";

export class JobRoleController {
	public constructor(private readonly jobRoleService: JobRoleService) {}

	public getJobRoles = async (
		_request: Request,
		response: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const jobRoles = await this.jobRoleService.getJobRoles();
			response.status(200).json(jobRoles);
		} catch (error) {
			next(error);
		}
	};

	public JobRoleDetailedResponse = async (
		request: Request,
		response: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const rawJobRoleId = request.params.id;
			const jobRoleId = Number(rawJobRoleId);

			if (!Number.isSafeInteger(jobRoleId) || jobRoleId <= 0) {
				response.status(400).json({ message: "Invalid job role id" });
				return;
			}

			const jobRole =
				await this.jobRoleService.JobRoleDetailedResponse(jobRoleId);
			if (jobRole) {
				response.status(200).json(jobRole);
			} else {
				response.status(404).json({ message: "Job role not found" });
			}
		} catch (error) {
			next(error);
		}
	};
}
