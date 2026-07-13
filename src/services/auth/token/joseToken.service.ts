// Create and signs a JWT containing the user ID and email

import type User from "../../../model/user.model";
import type TokenService from "./token.service";

export default class JoseTokenService implements TokenService {
	async create(user: User): Promise<string> {
		const accessSecret = process.env.JWT_ACCESS_SECRET;
		if (!accessSecret) {
			throw new Error("JWT_ACCESS_SECRET is not set");
		}

		const secret = new TextEncoder().encode(accessSecret);
		const { SignJWT } = await import("jose");

		return await new SignJWT({ userId: user.id, email: user.email })
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime("1h")
			.sign(secret);
	}
}
