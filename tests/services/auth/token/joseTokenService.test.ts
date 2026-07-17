import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type User from "../../../../src/models/userModel";
import JoseTokenService from "../../../../src/services/auth/token/joseTokenService";

// A secret that satisfies the >= 128 character requirement
const VALID_SECRET = "a".repeat(128);

// Minimal User fixture used across multiple tests
const testUser: User = {
	id: "user-cuid-123",
	email: "test@example.com",
	role: "user",
	passwordHash: "irrelevant-for-token",
	createdAt: new Date(),
	updatedAt: new Date(),
};

describe("JoseTokenService", () => {
	beforeEach(() => {
		vi.stubEnv("JWT_ACCESS_SECRET", VALID_SECRET);
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	describe("constructor validation", () => {
		it("throws when JWT_ACCESS_SECRET is not set", () => {
			vi.stubEnv("JWT_ACCESS_SECRET", "");

			expect(() => new JoseTokenService()).toThrow(
				"JWT_ACCESS_SECRET is not set",
			);
		});

		it("throws when JWT_ACCESS_SECRET is shorter than 128 characters", () => {
			vi.stubEnv("JWT_ACCESS_SECRET", "short-secret");

			expect(() => new JoseTokenService()).toThrow(
				"JWT_ACCESS_SECRET must be at least 128 characters",
			);
		});

		it("does not throw when JWT_ACCESS_SECRET is exactly 128 characters", () => {
			expect(() => new JoseTokenService()).not.toThrow();
		});
	});

	describe("create()", () => {
		it("returns a non-empty JWT string", async () => {
			const service = new JoseTokenService();

			const token = await service.create(testUser);

			expect(typeof token).toBe("string");
			expect(token.split(".")).toHaveLength(3); // header.payload.signature
		});

		it("encodes sub as the user id", async () => {
			const { jwtVerify } = await import("jose");
			const service = new JoseTokenService();

			const token = await service.create(testUser);
			const { payload } = await jwtVerify(token, Buffer.from(VALID_SECRET));

			expect(payload.sub).toBe(testUser.id);
		});

		it("encodes email in the payload", async () => {
			const { jwtVerify } = await import("jose");
			const service = new JoseTokenService();

			const token = await service.create(testUser);
			const { payload } = await jwtVerify(token, Buffer.from(VALID_SECRET));

			expect(payload.email).toBe(testUser.email);
		});

		it("encodes role in the payload", async () => {
			const { jwtVerify } = await import("jose");
			const service = new JoseTokenService();

			const token = await service.create(testUser);
			const { payload } = await jwtVerify(token, Buffer.from(VALID_SECRET));

			expect(payload.role).toBe(testUser.role);
		});

		it("sets an expiry on the token", async () => {
			const { jwtVerify } = await import("jose");
			const service = new JoseTokenService();

			const token = await service.create(testUser);
			const { payload } = await jwtVerify(token, Buffer.from(VALID_SECRET));

			expect(payload.exp).toBeDefined();
			expect(typeof payload.exp).toBe("number");
		});
	});
});
