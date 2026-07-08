import { ACCESS_TOKEN_TTL } from "../constants";
import type {
	LoginRequestDto,
	LoginResponseDto,
} from "../dto/login-request.dto";
import type {
	AuthSessionRepository,
	UpsertSessionInput,
} from "../repositories/auth-session.repository";
import { createSessionId } from "../session-id";
import type { AuthenticatedUser, TokenPair } from "../types";

export interface UserCredentialStore {
	findByEmail(email: string): Promise<{
		id: string;
		email: string;
		passwordHash: string;
	} | null>;
}

export interface PasswordVerifier {
	verify(plainText: string, hash: string): Promise<boolean>;
}

export interface TokenIssuer {
	issueTokenPair(input: {
		user: AuthenticatedUser;
		sessionId: string;
	}): Promise<TokenPair>;
}

export class AuthService {
	public constructor(
		private readonly userStore: UserCredentialStore,
		private readonly passwordVerifier: PasswordVerifier,
		private readonly tokenIssuer: TokenIssuer,
		private readonly sessionRepository: AuthSessionRepository,
	) {}

	public async login(input: LoginRequestDto): Promise<LoginResponseDto> {
		const user = await this.userStore.findByEmail(input.email);
		if (!user) {
			throw new Error("Invalid credentials");
		}

		const passwordMatches = await this.passwordVerifier.verify(
			input.password,
			user.passwordHash,
		);
		if (!passwordMatches) {
			throw new Error("Invalid credentials");
		}

		const sessionId = createSessionId();
		const tokenPair = await this.tokenIssuer.issueTokenPair({
			user: {
				id: user.id,
				email: user.email,
			},
			sessionId,
		});

		const sessionInput: UpsertSessionInput = {
			userId: user.id,
			sessionId,
			refreshTokenHash: "TODO_HASH_REFRESH_TOKEN",
			expiresAt: new Date(),
		};
		await this.sessionRepository.upsertSingleDeviceSession(sessionInput);

		return {
			accessToken: tokenPair.accessToken,
			tokenType: "Bearer",
			expiresIn: ACCESS_TOKEN_TTL,
			user: {
				id: user.id,
				email: user.email,
			},
		};
	}

	public async refresh(): Promise<void> {
		// TODO: verify refresh token cookie, rotate refresh token, issue new access token.
		throw new Error("Not implemented");
	}

	public async logoutCurrentSession(sessionId: string): Promise<void> {
		await this.sessionRepository.revokeSessionBySessionId(sessionId);
	}
}
