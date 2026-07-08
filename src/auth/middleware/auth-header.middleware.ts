import type { NextFunction, Request, Response } from "express";
import { AUTH_HEADER_PREFIX } from "../constants";

/**
 * Reads Authorization: Bearer <token> and stores token in res.locals.authToken.
 * TODO: verify JWT signature, exp, and session claims.
 */
export const readBearerToken = (
	request: Request,
	response: Response,
	next: NextFunction,
): void => {
	const header = request.header("authorization") ?? "";
	if (!header.startsWith(AUTH_HEADER_PREFIX)) {
		response.status(401).json({ message: "Missing Bearer token" });
		return;
	}

	response.locals.authToken = header.slice(AUTH_HEADER_PREFIX.length).trim();
	next();
};
