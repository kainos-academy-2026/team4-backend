import type { LoginRequestDto } from "../../Dto/loginRequest.dto";
import type { LoginResponseDto } from "../../Dto/loginResponse.dto";
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
		// Look up user in DB - if not found, reject login attempt
		const user = await this.userRepository.findByEmail(request.email);
		if (!user) {
			throw new InvalidCredentialsError();
		}
		// Compare plain password with stored hash - if wrong, reject login attempt
		const isPasswordValid = await this.passwordService.verify(
			request.password,
			user.passwordHash,
		);
		if (!isPasswordValid) {
			throw new InvalidCredentialsError();
		}
		// Signs the JWT with user's id and email, and returns it to the client
		const accessToken = await this.tokenService.create(user);

		return { accessToken };
	}
}
