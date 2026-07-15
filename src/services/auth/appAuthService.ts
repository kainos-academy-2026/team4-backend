import type { LoginRequestDto } from "../../dto/loginRequestDto";
import type { LoginResponseDto } from "../../dto/loginResponseDto";
import type { RegisterRequestDto } from "../../dto/registerRequest.dto";
import type { RegisterResponseDto } from "../../dto/registerResponse.dto";
import type User from "../../models/userModel";
import type UserRepository from "../../repositories/userRepo";
import type AuthService from "./authService";
import InvalidCredentialsError from "./errors/invalidCredentialsError";
import UserAlreadyExistsError from "./errors/userAlreadyExists.error";
import type PasswordService from "./password/passwordService";
import type TokenService from "./token/tokenService";

const isUniqueConstraintViolation = (error: unknown): boolean => {
	if (typeof error !== "object" || error === null) {
		return false;
	}

	if (!("code" in error)) {
		return false;
	}

	return (error as { code?: string }).code === "P2002";
};

export default class AppAuthService implements AuthService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly passwordService: PasswordService,
		private readonly tokenService: TokenService,
	) {}

	async login(request: LoginRequestDto): Promise<LoginResponseDto> {
		const user = await this.userRepository.findByEmail(request.email);
		const isPasswordValid = await this.passwordService.verify(
			request.password,
			user?.passwordHash,
		);
		if (!user) {
			throw new InvalidCredentialsError();
		}
		// Compare plain password with stored hash - if wrong, reject login attempt
		if (!isPasswordValid) {
			throw new InvalidCredentialsError();
		}
		// Signs the JWT with user's id and email, and returns it to the client
		const accessToken = await this.tokenService.create(user);

		return { accessToken };
	}

	async register(request: RegisterRequestDto): Promise<RegisterResponseDto> {
		const existingUser = await this.userRepository.findByEmail(request.email);
		if (existingUser) {
			throw new UserAlreadyExistsError();
		}

		const passwordHash = await this.passwordService.hash(request.password);
		let createdUser: User;
		try {
			createdUser = await this.userRepository.create(
				request.email,
				passwordHash,
			);
		} catch (error) {
			if (isUniqueConstraintViolation(error)) {
				throw new UserAlreadyExistsError();
			}

			throw error;
		}

		return {
			id: createdUser.id,
			email: createdUser.email,
			role: createdUser.role,
		};
	}

	async logout(): Promise<void> {
		// Header token strategy MVP: client removes token from browser session.
		return;
	}
}
