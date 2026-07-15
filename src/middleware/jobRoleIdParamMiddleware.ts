import type { NextFunction, Request, Response } from "express";
import { JobRoleIdParamSchema } from "../dto/jobRoleIdParamDto";

export const validateJobRoleIdParam = (
	request: Request,
	response: Response,
	next: NextFunction,
): void => {
	const parsed = JobRoleIdParamSchema.safeParse(request.params);

	if (!parsed.success) {
		response.status(400).json({ message: "Invalid job role id" });
		return;
	}

	request.params.id = String(parsed.data.id);
	next();
};
