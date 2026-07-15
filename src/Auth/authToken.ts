import { type JWTPayload, jwtVerify, SignJWT } from "jose";
import type { Role } from "./role";

interface SignTokenInput {
	userId: number;
	email: string;
	role: Role;
}

export interface AuthTokenPayload extends JWTPayload {
	email?: string;
	role?: string;
}

const getJwtSecret = (): Uint8Array => {
	const jwtSecret = process.env.JWT_SECRET?.trim();
	if (!jwtSecret) {
		throw new Error("JWT_SECRET is required to sign and verify tokens");
	}

	return new TextEncoder().encode(jwtSecret);
};

export const signAuthToken = async ({
	userId,
	email,
	role,
}: SignTokenInput): Promise<string> => {
	const secret = getJwtSecret();

	return new SignJWT({ email, role })
		.setProtectedHeader({ alg: "HS256" })
		.setSubject(String(userId))
		.setIssuedAt()
		.setExpirationTime("1h")
		.sign(secret);
};

export const verifyAuthToken = async (
	token: string,
): Promise<AuthTokenPayload> => {
	const secret = getJwtSecret();
	const { payload } = await jwtVerify(token, secret);

	return payload;
};
