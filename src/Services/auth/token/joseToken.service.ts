// Creates and signs a JWT containing the user ID, email, and role

import { ACCESS_TOKEN_TTL } from "../../../constants";
import type User from "../../../Models/user.model";
import type TokenService from "./token.service";

export default class JoseTokenService implements TokenService {
	async create(user: User): Promise<string> {
		const accessSecret = process.env.JWT_ACCESS_SECRET;
		if (!accessSecret) {
			throw new Error("JWT_ACCESS_SECRET is not set");
		}
		if (!/^[0-9a-fA-F]{128}$/.test(accessSecret)) {
			throw new Error("JWT_ACCESS_SECRET must be 128 hex characters (64 bytes)");
		}

		const secret = Buffer.from(accessSecret, "hex");
		const { SignJWT } = await import("jose");

		return await new SignJWT({
			userId: user.id,
			email: user.email,
			role: user.role,
		})
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime(ACCESS_TOKEN_TTL)
			.sign(secret);
	}
}
