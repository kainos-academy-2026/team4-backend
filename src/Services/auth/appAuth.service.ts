import type { LoginRequestDto } from "../../dto/loginRequest.dto";
import type { LoginResponseDto } from "../../dto/loginResponse.dto";
import type UserRepository from "../../repositories/user.repo";
import type AuthService from "./auth.service";
import InvalidCredentialsError from "./errors/invalidCredentials.error";
import type PasswordService from "./password/password.service";
import type TokenService from "./token/token.service";

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
