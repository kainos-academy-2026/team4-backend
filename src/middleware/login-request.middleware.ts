import type { NextFunction, Request, Response } from "express";
import { LoginRequestSchema } from "../dto/loginRequest.dto";

export const validateLoginRequest = (
	request: Request,
	response: Response,
	next: NextFunction,
): void => {
	const parsed = LoginRequestSchema.safeParse(request.body);
	if (!parsed.success) {
		response.status(400).json({ message: "Invalid login payload" });
		return;
	}

	request.body = parsed.data;
	next();
};
