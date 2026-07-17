export interface AuthTokenPayload {
	sub?: string;
	email?: string;
	role?: string;
	iat?: number;
	exp?: number;
}

const getJwtSecret = (): Uint8Array => {
	const jwtSecret = process.env.JWT_ACCESS_SECRET?.trim();
	if (!jwtSecret) {
		throw new Error("JWT_ACCESS_SECRET is required to sign and verify tokens");
	}

	return new TextEncoder().encode(jwtSecret);
};

export const verifyAuthToken = async (
	token: string,
): Promise<AuthTokenPayload> => {
	const { jwtVerify } = await import("jose");
	const secret = getJwtSecret();
	const { payload } = await jwtVerify(token, secret);

	return payload;
};
