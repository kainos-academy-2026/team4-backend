import type { Express, NextFunction, Request, Response } from "express";
import { JobRoleController } from "../Controller/jobRoleController";

export const registerJobRoleRoutes = (app: Express): void => {
	const jobRoleController = new JobRoleController();

	app.get(
		"/job-roles",
		(request: Request, response: Response, next: NextFunction) => {
			return jobRoleController.getJobRoles(request, response, next);
		},
	);
};
