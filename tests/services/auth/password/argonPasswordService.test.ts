import argon2 from "argon2";
import { describe, expect, it } from "vitest";
import ArgonPasswordService from "../../../../src/services/auth/password/argonPasswordService";

describe("ArgonPasswordService", () => {
	it("returns true when password matches hash", async () => {
		const password = "Password123!";
		const hash = await argon2.hash(password);
		const service = new ArgonPasswordService();

		await expect(service.verify(password, hash)).resolves.toBe(true);
	});

	it("returns false when password does not match hash", async () => {
		const hash = await argon2.hash("Password123!");
		const service = new ArgonPasswordService();

		await expect(service.verify("WrongPassword123!", hash)).resolves.toBe(
			false,
		);
	});

	it("returns false when hash is missing", async () => {
		const service = new ArgonPasswordService();

		await expect(service.verify("Password123!", undefined)).resolves.toBe(
			false,
		);
	});
});
