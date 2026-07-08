import type { Request, Response } from "express";
import type { LoginRequestDto } from "../dto/login-request.dto";
import type { AuthService } from "../services/auth.service";

export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	public login = async (
		request: Request,
		response: Response,
	): Promise<void> => {
		const dto = request.body as LoginRequestDto;

		try {
			const result = await this.authService.login(dto);
			// TODO: set refresh cookie: HttpOnly + Secure + SameSite=Strict
			response.status(200).json(result);
		} catch {
			response.status(401).json({ message: "Invalid credentials" });
		}
	};

	public refresh = async (
		_request: Request,
		response: Response,
	): Promise<void> => {
		response.status(501).json({
			message: "Refresh scaffold created. Implement token rotation next.",
		});
	};

	public logout = async (
		_request: Request,
		response: Response,
	): Promise<void> => {
		// TODO: resolve current sessionId from validated token and revoke current session only
		response.status(204).send();
	};
}
