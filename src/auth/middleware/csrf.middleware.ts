import type { NextFunction, Request, Response } from "express";

/**
 * CSRF scaffold for state-changing routes.
 * TODO: replace with production-ready CSRF strategy (double submit or framework middleware).
 */
export const verifyCsrf = (
	request: Request,
	response: Response,
	next: NextFunction,
): void => {
	const csrfHeader = request.header("x-csrf-token");
	const csrfCookie = request.header("x-csrf-cookie");

	if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
		response.status(403).json({ message: "Invalid CSRF token" });
		return;
	}

	next();
};
