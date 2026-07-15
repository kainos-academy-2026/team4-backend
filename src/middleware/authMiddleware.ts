import type { NextFunction, Request, Response } from "express";
import { errors as joseErrors } from "jose";
import { verifyAuthToken } from "../Auth/authToken";
import { isRole, Role } from "../Auth/role";

const ALL_ROLES = [Role.Admin, Role.User] as const;

const getBearerToken = (authorizationHeader: unknown): string | null => {
	if (typeof authorizationHeader !== "string") {
		return null;
	}

	const [scheme, token, ...rest] = authorizationHeader.split(" ");
	if (scheme !== "Bearer" || !token || rest.length > 0) {
		return null;
	}

	return token;
};

export const authorize = (allowedRoles: readonly Role[] = ALL_ROLES) => {
	return async (
		request: Request,
		response: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const token = getBearerToken(request.headers.authorization);
			if (!token) {
				response.status(401).json({ message: "Unauthorized" });
				return;
			}

			const payload = await verifyAuthToken(token);
			if (!isRole(payload.role)) {
				response.status(401).json({ message: "Unauthorized" });
				return;
			}

			const userId = Number(payload.sub);
			if (!Number.isSafeInteger(userId) || userId <= 0) {
				response.status(401).json({ message: "Unauthorized" });
				return;
			}

			if (!allowedRoles.includes(payload.role)) {
				response.status(403).json({ message: "Forbidden" });
				return;
			}

			request.authUser = {
				id: userId,
				email: typeof payload.email === "string" ? payload.email : "",
				role: payload.role,
			};

			next();
		} catch (error) {
			if (
				error instanceof joseErrors.JWTExpired ||
				error instanceof joseErrors.JWTInvalid ||
				error instanceof joseErrors.JWSSignatureVerificationFailed
			) {
				response.status(401).json({ message: "Unauthorized" });
				return;
			}

			next(error);
		}
	};
};
