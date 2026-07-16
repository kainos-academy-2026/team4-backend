import type { NextFunction, Request, Response } from "express";
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

			const userId = payload.sub;
			if (!userId) {
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
			const { errors: joseErrors } = await import("jose");
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
import type { NextFunction, Request, Response } from "express";
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

			const userId = payload.sub;
			if (!userId) {
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
			const { errors: joseErrors } = await import("jose");
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
import type { NextFunction, Request, Response } from "express";
import { AuthPayloadSchema } from "../dto/authPayloadDto";

export interface AuthenticatedUser {
	userId: string;
	email: string;
	role: string;
}

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			user?: AuthenticatedUser;
		}
	}
}

export const requireAuth = async (
	request: Request,
	response: Response,
	next: NextFunction,
): Promise<void> => {
	const authHeader = request.headers.authorization;

	if (!authHeader?.startsWith("Bearer ")) {
		response.status(401).json({ message: "Unauthorised" });
		return;
	}

	const token = authHeader.slice(7);
	const accessSecret = process.env.JWT_ACCESS_SECRET;

	if (!accessSecret) {
		response.status(500).json({ message: "Internal server error" });
		return;
	}

	try {
		const { jwtVerify } = await import("jose");
		const { payload } = await jwtVerify(token, Buffer.from(accessSecret));

		const parsed = AuthPayloadSchema.safeParse(payload);
		if (!parsed.success) {
			response.status(401).json({ message: "Unauthorised" });
			return;
		}

		request.user = parsed.data;
		next();
	} catch {
		response.status(401).json({ message: "Unauthorised" });
	}
};
