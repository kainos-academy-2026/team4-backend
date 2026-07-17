// Creates and signs a JWT containing the user ID, email, and role

import { ACCESS_TOKEN_TTL } from "../../../constants";
import type User from "../../../models/userModel";
import type TokenService from "./tokenService";

export default class JoseTokenService implements TokenService {
	private readonly secret: Buffer;

	constructor() {
		const accessSecret = process.env.JWT_ACCESS_SECRET;
		if (!accessSecret) {
			throw new Error("JWT_ACCESS_SECRET is not set");
		}
		if (accessSecret.length < 128) {
			throw new Error("JWT_ACCESS_SECRET must be at least 128 characters");
		}

		this.secret = Buffer.from(accessSecret);
	}

	async create(user: User): Promise<string> {
		const { SignJWT } = await import("jose");

		// userId is set as the standard JWT "sub" claim so verifyAuthToken can read payload.sub
		return await new SignJWT({
			email: user.email,
			role: user.role,
		})
			.setProtectedHeader({ alg: "HS256" })
			.setSubject(String(user.id))
			.setIssuedAt()
			.setExpirationTime(ACCESS_TOKEN_TTL)
			.sign(this.secret);
	}
}
