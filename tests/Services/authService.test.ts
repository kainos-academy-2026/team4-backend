import { beforeEach, describe, expect, it, vi } from "vitest";
import { Role } from "../../src/Auth/role";
import {
	AuthService,
	InvalidCredentialsError,
	UserAlreadyExistsError,
} from "../../src/Services/authService";

const mockedSignAuthToken = vi.hoisted(() => vi.fn());

vi.mock("../../src/Auth/authToken", () => ({
	signAuthToken: mockedSignAuthToken,
}));

describe("auth service", () => {
	beforeEach(() => {
		mockedSignAuthToken.mockReset();
	});

	it("throws when registering an email that already exists", async () => {
		const service = new AuthService({
			findByEmail: vi.fn(async () => ({
				id: 1,
				email: "user@example.com",
				password: "password",
				role: Role.User,
			})),
			createUser: vi.fn(),
		});

		await expect(
			service.register({
				email: "user@example.com",
				password: "password",
				role: Role.User,
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});

	it("creates user and returns token on successful registration", async () => {
		mockedSignAuthToken.mockResolvedValueOnce("signed-token");
		const createUser = vi.fn(async () => ({
			id: 5,
			email: "new@example.com",
			password: "pass",
			role: Role.Admin,
		}));
		const service = new AuthService({
			findByEmail: vi.fn(async () => null),
			createUser,
		});

		const result = await service.register({
			email: "new@example.com",
			password: "pass",
			role: Role.Admin,
		});

		expect(createUser).toHaveBeenCalledWith({
			email: "new@example.com",
			password: "pass",
			role: Role.Admin,
		});
		expect(result).toEqual({ token: "signed-token" });
	});

	it("throws InvalidCredentialsError when login password is wrong", async () => {
		const service = new AuthService({
			findByEmail: vi.fn(async () => ({
				id: 10,
				email: "user@example.com",
				password: "correct",
				role: Role.User,
			})),
			createUser: vi.fn(),
		});

		await expect(
			service.login({
				email: "user@example.com",
				password: "wrong",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it("returns token when login credentials are valid", async () => {
		mockedSignAuthToken.mockResolvedValueOnce("login-token");
		const service = new AuthService({
			findByEmail: vi.fn(async () => ({
				id: 42,
				email: "admin@example.com",
				password: "pw",
				role: Role.Admin,
			})),
			createUser: vi.fn(),
		});

		const result = await service.login({
			email: "admin@example.com",
			password: "pw",
		});

		expect(result).toEqual({ token: "login-token" });
	});
});
