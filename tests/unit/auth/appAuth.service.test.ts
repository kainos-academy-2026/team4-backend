import { beforeEach, describe, expect, it, vi } from "vitest";
import type User from "../../../src/Models/user.model";
import type UserRepository from "../../../src/repositories/user.repo";
import AppAuthService from "../../../src/Services/auth/appAuth.service";
import type PasswordService from "../../../src/Services/auth/password/password.service";
import type TokenService from "../../../src/Services/auth/token/token.service";

// MOCK DATA AND DEPENDENCIES
// Fake implementations of the dependencies that AppAuthService relies on

const mockUserRepository: UserRepository = {
	findByEmail: vi.fn(),
};

const mockPasswordService: PasswordService = {
	verify: vi.fn(),
};

const mockTokenService: TokenService = {
	create: vi.fn(),
};

// SHARED TEST DATA
// Fake user row
const fakeUser: User = {
	id: "user-123",
	email: "test@example.com",
	role: "user",
	passwordHash: "hashed-password",
	createdAt: new Date(),
	updatedAt: new Date(),
};

// --- TESTS ---
describe("AppAuthService", () => {
	let authService: AppAuthService;

	// beforeEach runs before EVERY test below, giving each test a clean slate
	beforeEach(() => {
		vi.clearAllMocks(); // reset mock call counts and return values
		authService = new AppAuthService(
			mockUserRepository,
			mockPasswordService,
			mockTokenService,
		);
	});

	// --- Test 1: email not in database ---
	it("throws Invalid credentials when user is not found", async () => {
		// Tell the mock: pretend no user exists with this email
		vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
		vi.mocked(mockPasswordService.verify).mockResolvedValue(false);

		// expect(...).rejects.toThrow() asserts that the promise throws
		await expect(
			authService.login({ email: "notfound@example.com", password: "any" }),
		).rejects.toThrow("Invalid credentials");

		expect(mockPasswordService.verify).toHaveBeenCalledTimes(1);
		expect(mockPasswordService.verify).toHaveBeenCalledWith("any", undefined);
	});

	// --- Test 2: email exists but wrong password ---
	it("throws Invalid credentials when password is wrong", async () => {
		// Tell the mock: user exists in DB
		vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(fakeUser);
		// Tell the mock: password verification fails
		vi.mocked(mockPasswordService.verify).mockResolvedValue(false);

		await expect(
			authService.login({ email: fakeUser.email, password: "wrongpassword" }),
		).rejects.toThrow("Invalid credentials");
	});

	// --- Test 3: correct email and password ---
	it("returns an accessToken when credentials are valid", async () => {
		// Tell the mock: user exists in DB
		vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(fakeUser);
		// Tell the mock: password matches
		vi.mocked(mockPasswordService.verify).mockResolvedValue(true);
		// Tell the mock: token service returns a fake token string
		vi.mocked(mockTokenService.create).mockResolvedValue("fake-jwt-token");

		const result = await authService.login({
			email: fakeUser.email,
			password: "correctpassword",
		});

		expect(result).toEqual({ accessToken: "fake-jwt-token" });
	});
});
