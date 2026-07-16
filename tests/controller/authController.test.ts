import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthController } from "../../src/controller/authController";
import type AuthService from "../../src/services/auth/authService";
import InvalidCredentialsError from "../../src/services/auth/errors/invalidCredentialsError";
import UserAlreadyExistsError from "../../src/services/auth/errors/userAlreadyExists.error";

const mockAuthService: AuthService = {
	login: vi.fn(),
	register: vi.fn(),
};

describe("AuthController", () => {
	let controller: AuthController;
	let response: Response;
	let statusMock: ReturnType<typeof vi.fn>;
	let jsonMock: ReturnType<typeof vi.fn>;
	let sendMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		vi.clearAllMocks();
		controller = new AuthController(mockAuthService);
		jsonMock = vi.fn();
		sendMock = vi.fn();
		statusMock = vi.fn(() => ({ json: jsonMock, send: sendMock }));
		response = { status: statusMock } as unknown as Response;
	});

	it("returns 200 with token on successful login", async () => {
		vi.mocked(mockAuthService.login).mockResolvedValue({
			accessToken: "token-123",
		});

		const request = {
			body: { email: "test@example.com", password: "password" },
		} as Request;

		await controller.login(request, response);

		expect(statusMock).toHaveBeenCalledWith(200);
		expect(jsonMock).toHaveBeenCalledWith({ accessToken: "token-123" });
	});

	it("returns 401 on invalid credentials", async () => {
		vi.mocked(mockAuthService.login).mockRejectedValue(
			new InvalidCredentialsError(),
		);

		const request = {
			body: { email: "test@example.com", password: "wrong" },
		} as Request;

		await controller.login(request, response);

		expect(statusMock).toHaveBeenCalledWith(401);
		expect(jsonMock).toHaveBeenCalledWith({ message: "Invalid credentials" });
	});

	it("returns 500 on unexpected login error", async () => {
		vi.mocked(mockAuthService.login).mockRejectedValue(new Error("boom"));

		const request = {
			body: { email: "test@example.com", password: "password" },
		} as Request;

		await controller.login(request, response);

		expect(statusMock).toHaveBeenCalledWith(500);
		expect(jsonMock).toHaveBeenCalledWith({ message: "Internal server error" });
	});

	it("returns 201 with safe user data on successful registration", async () => {
		vi.mocked(mockAuthService.register).mockResolvedValue({
			id: "user-123",
			email: "test@example.com",
			role: "user",
		});

		const request = {
			body: { email: "test@example.com", password: "Password1!" },
		} as Request;

		await controller.register(request, response);

		expect(statusMock).toHaveBeenCalledWith(201);
		expect(jsonMock).toHaveBeenCalledWith({
			id: "user-123",
			email: "test@example.com",
			role: "user",
		});
	});

	it("returns 409 when the registration email already exists", async () => {
		vi.mocked(mockAuthService.register).mockRejectedValue(
			new UserAlreadyExistsError(),
		);

		const request = {
			body: { email: "test@example.com", password: "Password1!" },
		} as Request;

		await controller.register(request, response);

		expect(statusMock).toHaveBeenCalledWith(409);
		expect(jsonMock).toHaveBeenCalledWith({ message: "User already exists" });
	});

	it("returns 500 on unexpected registration error", async () => {
		vi.mocked(mockAuthService.register).mockRejectedValue(new Error("boom"));

		const request = {
			body: { email: "test@example.com", password: "Password1!" },
		} as Request;

		await controller.register(request, response);

		expect(statusMock).toHaveBeenCalledWith(500);
		expect(jsonMock).toHaveBeenCalledWith({ message: "Internal server error" });
	});
});
