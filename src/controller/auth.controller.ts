import type { Request, Response } from "express";
import type { LoginRequestDto } from "../dto/loginRequest.dto";
import type AuthService from "../services/auth/auth.service";
import InvalidCredentialsError from "../services/auth/errors/invalidCredentials.error";

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
}
