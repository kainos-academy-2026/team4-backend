import type { Request, Response } from "express";
import type { LoginRequestDto } from "../dto/loginRequestDto";
import type { RegisterRequestDto } from "../dto/registerRequest.dto";
import type AuthService from "../services/auth/authService";
import InvalidCredentialsError from "../services/auth/errors/invalidCredentialsError";
import UserAlreadyExistsError from "../services/auth/errors/userAlreadyExists.error";

export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	public login = async (
		request: Request,
		response: Response,
	): Promise<void> => {
		const dto = request.body as LoginRequestDto;

		try {
			const result = await this.authService.login(dto);
			response.status(200).json(result);
		} catch (error) {
			if (error instanceof InvalidCredentialsError) {
				response.status(401).json({ message: "Invalid credentials" });
				return;
			}
			response.status(500).json({ message: "Internal server error" });
		}
	};

	public register = async (
		request: Request,
		response: Response,
	): Promise<void> => {
		const dto = request.body as RegisterRequestDto;

		try {
			const result = await this.authService.register(dto);
			response.status(201).json(result);
		} catch (error) {
			if (error instanceof UserAlreadyExistsError) {
				response.status(409).json({ message: "User already exists" });
				return;
			}
			response.status(500).json({ message: "Internal server error" });
		}
	};
}
