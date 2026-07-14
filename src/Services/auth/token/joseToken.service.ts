// Creates and signs a JWT containing the user ID, email, and role

import { ACCESS_TOKEN_TTL } from "../../../constants";
import type User from "../../../Models/user.model";
import type TokenService from "./token.service";

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

		return await new SignJWT({
			userId: user.id,
			email: user.email,
			role: user.role,
		})
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime(ACCESS_TOKEN_TTL)
			.sign(this.secret);
	}
}
