import type { LoginRequestDto } from "../../Dto/loginRequest.dto";
import type { LoginResponseDto } from "../../Dto/loginResponse.dto";
import type UserRepository from "../../repositories/user.repo";
import type AuthService from "./auth.service";
import InvalidCredentialsError from "./errors/invalidCredentials.error";
import type PasswordService from "./password/password.service";
import type TokenService from "./token/token.service";

// Argon2id hash for a fixed dummy password used to reduce user-enumeration timing variance.
const DUMMY_PASSWORD_HASH =
	"$argon2id$v=19$m=65536,t=3,p=4$dHVtbXlfc2FsdF92YWx1ZQ$2aQ6eNv2YJEO2ubVhtSGcjyxjB1j1l3fMijLhSLiOB0";

export default class AppAuthService implements AuthService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly passwordService: PasswordService,
		private readonly tokenService: TokenService,
	) {}

	async login(request: LoginRequestDto): Promise<LoginResponseDto> {
		// Always perform a verify call to reduce timing differences for missing vs existing users.
		const user = await this.userRepository.findByEmail(request.email);
		const hashToVerify = user?.passwordHash ?? DUMMY_PASSWORD_HASH;
		const isPasswordValid = await this.passwordService.verify(
			request.password,
			hashToVerify,
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
