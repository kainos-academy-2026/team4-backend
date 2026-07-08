import type { NextFunction, Request, Response } from "express";
import { JobRoleService } from "../Services/jobRoleService";

export class JobRoleController {
	public constructor(
		private readonly jobRoleService: JobRoleService
	) {}

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
}