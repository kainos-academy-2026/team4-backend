// Create and signs a JWT containing the user ID and email

import type { User } from "@prisma/client";
import type TokenService from "./token.service";

export default class JoseTokenService implements TokenService {
	async create(user: User): Promise<string> {
		const { SignJWT } = await import("jose");
		const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

		return await new SignJWT({ userId: user.id, email: user.email })
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime("1h")
			.sign(secret);
	}
}
