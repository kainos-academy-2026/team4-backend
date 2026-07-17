import type { NextFunction, Request, Response } from "express";
import type { JobRoleService } from "../services/jobRoleService";

export class JobRoleController {
	public constructor(private readonly jobRoleService: JobRoleService) {}

	public getJobRoles = async (
		request: Request,
		response: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const userId = request.user?.userId;
			const jobRoles = await this.jobRoleService.getJobRoles(userId);
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
			const jobRoleId = Number(request.params.id);
			const userId = request.user?.userId;

			const jobRole = await this.jobRoleService.JobRoleDetailedResponse(
				jobRoleId,
				userId,
			);
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
