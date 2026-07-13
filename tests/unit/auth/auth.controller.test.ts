import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthController } from "../../../src/controllers/auth.controller";
import type AuthService from "../../../src/Services/auth/auth.service";
import InvalidCredentialsError from "../../../src/Services/auth/errors/invalidCredentials.error";

const mockAuthService: AuthService = {
	login: vi.fn(),
	logout: vi.fn(),
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

	it("returns 204 on successful logout", async () => {
		vi.mocked(mockAuthService.logout).mockResolvedValue(undefined);

		await controller.logout({} as Request, response);

		expect(statusMock).toHaveBeenCalledWith(204);
		expect(sendMock).toHaveBeenCalled();
	});

	it("returns 500 on logout error", async () => {
		vi.mocked(mockAuthService.logout).mockRejectedValue(new Error("boom"));

		await controller.logout({} as Request, response);

		expect(statusMock).toHaveBeenCalledWith(500);
		expect(jsonMock).toHaveBeenCalledWith({ message: "Internal server error" });
	});
});
