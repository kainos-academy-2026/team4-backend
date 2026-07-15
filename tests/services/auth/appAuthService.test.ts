import { beforeEach, describe, expect, it, vi } from "vitest";
import type User from "../../../src/models/userModel";
import type UserRepository from "../../../src/repositories/userRepo";
import AppAuthService from "../../../src/services/auth/appAuthService";
import UserAlreadyExistsError from "../../../src/services/auth/errors/userAlreadyExists.error";
import type PasswordService from "../../../src/services/auth/password/passwordService";
import type TokenService from "../../../src/services/auth/token/tokenService";

// MOCK DATA AND DEPENDENCIES
// Fake implementations of the dependencies that AppAuthService relies on

const mockUserRepository: UserRepository = {
	create: vi.fn(),
	findByEmail: vi.fn(),
};

const mockPasswordService: PasswordService = {
	hash: vi.fn(),
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

	it("throws when registering an email that already exists", async () => {
		vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(fakeUser);

		await expect(
			authService.register({
				email: fakeUser.email,
				password: "Password1!",
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
		expect(mockPasswordService.hash).not.toHaveBeenCalled();
		expect(mockUserRepository.create).not.toHaveBeenCalled();
	});

	it("throws when create hits a unique constraint race", async () => {
		vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
		vi.mocked(mockPasswordService.hash).mockResolvedValue("hashed-password");
		vi.mocked(mockUserRepository.create).mockRejectedValue({ code: "P2002" });

		await expect(
			authService.register({
				email: fakeUser.email,
				password: "Password1!",
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});

	it("rethrows create errors that are not object-shaped", async () => {
		vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
		vi.mocked(mockPasswordService.hash).mockResolvedValue("hashed-password");
		vi.mocked(mockUserRepository.create).mockRejectedValue("db exploded");

		await expect(
			authService.register({
				email: fakeUser.email,
				password: "Password1!",
			}),
		).rejects.toBe("db exploded");
	});

	it("rethrows create errors that do not expose a Prisma code", async () => {
		vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
		vi.mocked(mockPasswordService.hash).mockResolvedValue("hashed-password");
		const genericError = new Error("db failed");
		vi.mocked(mockUserRepository.create).mockRejectedValue(genericError);

		await expect(
			authService.register({
				email: fakeUser.email,
				password: "Password1!",
			}),
		).rejects.toBe(genericError);
	});

	it("hashes the password and creates a user when registering", async () => {
		vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
		vi.mocked(mockPasswordService.hash).mockResolvedValue("hashed-password");
		vi.mocked(mockUserRepository.create).mockResolvedValue(fakeUser);

		const result = await authService.register({
			email: fakeUser.email,
			password: "Password1!",
		});

		expect(mockPasswordService.hash).toHaveBeenCalledWith("Password1!");
		expect(mockUserRepository.create).toHaveBeenCalledWith(
			fakeUser.email,
			"hashed-password",
		);
		expect(result).toEqual({
			id: fakeUser.id,
			email: fakeUser.email,
			role: fakeUser.role,
		});
	});

	it("returns without side effects on logout", async () => {
		await expect(authService.logout()).resolves.toBeUndefined();
		expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
		expect(mockUserRepository.create).not.toHaveBeenCalled();
		expect(mockPasswordService.hash).not.toHaveBeenCalled();
		expect(mockPasswordService.verify).not.toHaveBeenCalled();
		expect(mockTokenService.create).not.toHaveBeenCalled();
	});
});
