import type { NextFunction, Request, Response } from "express";
import { isRole } from "../Auth/role";
import {
	type AuthService,
	InvalidCredentialsError,
	UserAlreadyExistsError,
} from "../Services/authService";

export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	public register = async (
		request: Request,
		response: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const { email, password, role } = request.body as {
				email?: unknown;
				password?: unknown;
				role?: unknown;
			};

			if (
				typeof email !== "string" ||
				email.trim() === "" ||
				typeof password !== "string" ||
				password.trim() === "" ||
				!isRole(role)
			) {
				response.status(400).json({
					message: "email, password and role (admin|user) are required",
				});
				return;
			}

			const result = await this.authService.register({
				email: email.trim().toLowerCase(),
				password,
				role,
			});

			response.status(201).json(result);
		} catch (error) {
			if (error instanceof UserAlreadyExistsError) {
				response.status(409).json({ message: error.message });
				return;
			}

			next(error);
		}
	};

	public login = async (
		request: Request,
		response: Response,
	): Promise<void> => {
		try {
			const { email, password } = request.body as {
				email?: unknown;
				password?: unknown;
			};

			if (
				typeof email !== "string" ||
				email.trim() === "" ||
				typeof password !== "string" ||
				password.trim() === ""
			) {
				response
					.status(400)
					.json({ message: "email and password are required" });
				return;
			}

			const result = await this.authService.login({
				email: email.trim().toLowerCase(),
				password,
			});

			response.status(200).json(result);
		} catch (error) {
			if (error instanceof InvalidCredentialsError) {
				response.status(401).json({ message: error.message });
				return;
			}
		}
	};
}
