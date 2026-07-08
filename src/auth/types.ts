export type AccessTokenPayload = {
	sub: string;
	email: string;
	sessionId: string;
};

export type TokenPair = {
	accessToken: string;
	refreshToken: string;
};

export type AuthenticatedUser = {
	id: string;
	email: string;
};

export type SessionRecord = {
	id: string;
	userId: string;
	sessionId: string;
	refreshTokenHash: string;
	expiresAt: Date;
	revokedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
};
