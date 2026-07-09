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
	const cookieHeader = request.header("cookie") ?? "";
	const csrfCookie = cookieHeader
		.split(";")
		.map((part) => part.trim())
		.find((part) => part.startsWith("csrf_token="))
		?.slice("csrf_token=".length);

	if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
		response.status(403).json({ message: "Invalid CSRF token" });
		return;
	}

	next();
};
