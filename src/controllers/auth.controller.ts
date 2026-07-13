import type { Request, Response } from "express";
import type { LoginRequestDto } from "../Dto/loginRequest.dto";
import InvalidCredentialsError from "../Services/auth/errors/invalidCredentials.error";
import type AuthService from "../Services/auth/auth.service";

export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	public login = async (
		request: Request,
		response: Response,
	): Promise<void> => {
		const dto = request.body as LoginRequestDto;

		try {
			const result = await this.authService.login(dto); // TODO: set refresh cookie: HttpOnly + Secure + SameSite=Strict
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
