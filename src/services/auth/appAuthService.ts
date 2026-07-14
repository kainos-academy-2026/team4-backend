import type { LoginRequestDto } from "../../dto/loginRequestDto";
import type { LoginResponseDto } from "../../dto/loginResponseDto";
import type UserRepository from "../../repositories/userRepo";
import type AuthService from "./authService";
import InvalidCredentialsError from "./errors/invalidCredentialsError";
import type PasswordService from "./password/passwordService";
import type TokenService from "./token/tokenService";

export default class AppAuthService implements AuthService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly passwordService: PasswordService,
		private readonly tokenService: TokenService,
	) {}

	async login(request: LoginRequestDto): Promise<LoginResponseDto> {
		// Always perform a verify call to reduce timing differences for missing vs existing users.
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
}
