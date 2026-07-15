import { describe, expect, it, vi } from "vitest";
import ArgonPasswordService from "../../../src/services/auth/password/argonPasswordService";

describe("ArgonPasswordService", () => {
	it("hashes and verifies a password", async () => {
		const passwordService = new ArgonPasswordService();
		const password = "Password1!";

		const hash = await passwordService.hash(password);

		expect(hash).not.toBe(password);
		await expect(passwordService.verify(password, hash)).resolves.toBe(true);
	});

	it("returns false when verifying with no user hash", async () => {
		const passwordService = new ArgonPasswordService();

		await expect(passwordService.verify("Password1!", undefined)).resolves.toBe(
			false,
		);
	});

	it("returns false when the hash is malformed", async () => {
		const passwordService = new ArgonPasswordService();
		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => undefined);

		await expect(
			passwordService.verify("Password1!", "not-a-valid-hash"),
		).resolves.toBe(false);
		expect(consoleErrorSpy).toHaveBeenCalled();

		consoleErrorSpy.mockRestore();
	});
});
