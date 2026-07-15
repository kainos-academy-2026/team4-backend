import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockedPost = vi.fn();
const mockedRouter = { post: mockedPost };
const mockedController = {
	register: vi.fn(),
	login: vi.fn(),
	logout: vi.fn(),
};

vi.mock("express", () => ({
	Router: vi.fn(() => mockedRouter),
}));

vi.mock("../../src/prismaClient", () => ({
	getPrismaClient: vi.fn(() => ({})),
}));

vi.mock("../../src/repositories/prismaUserRepo", () => ({
	default: vi.fn(function PrismaUserRepositoryMock() {
		return {};
	}),
}));

vi.mock("../../src/services/auth/password/argonPasswordService", () => ({
	default: vi.fn(function ArgonPasswordServiceMock() {
		return {};
	}),
}));

vi.mock("../../src/services/auth/token/joseTokenService", () => ({
	default: vi.fn(function JoseTokenServiceMock() {
		return {};
	}),
}));

vi.mock("../../src/services/auth/appAuthService", () => ({
	default: vi.fn(function AppAuthServiceMock() {
		return {};
	}),
}));

vi.mock("../../src/controller/authController", () => ({
	AuthController: vi.fn(function AuthControllerMock() {
		return mockedController;
	}),
}));

describe("authRouter", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("registers POST /register, POST /login and POST /logout routes", async () => {
		await import("../../src/routes/authRoutes");

		expect(mockedPost).toHaveBeenCalledTimes(3);
		expect(mockedPost).toHaveBeenCalledWith(
			"/register",
			expect.any(Function),
			mockedController.register,
		);
		expect(mockedPost).toHaveBeenCalledWith(
			"/login",
			expect.any(Function),
			expect.any(Function),
		);
		expect(mockedPost).toHaveBeenCalledWith("/logout", mockedController.logout);
	});

	it("returns 400 when login payload is invalid", async () => {
		await import("../../src/routes/authRoutes");

		const loginCall = mockedPost.mock.calls.find(
			(call) => call[0] === "/login",
		);
		expect(loginCall).toBeDefined();

		const validator = loginCall?.[1] as (
			request: Request,
			response: Response,
			next: NextFunction,
		) => void;

		const statusMock = vi.fn(() => ({ json: vi.fn() }));
		const response = { status: statusMock } as unknown as Response;
		const next = vi.fn();

		validator(
			{ body: { email: "not-an-email", password: "" } } as Request,
			response,
			next,
		);

		expect(statusMock).toHaveBeenCalledWith(400);
		expect(next).not.toHaveBeenCalled();
	});

	it("returns 400 when registration payload is invalid", async () => {
		await import("../../src/routes/authRoutes");

		const registerCall = mockedPost.mock.calls.find(
			(call) => call[0] === "/register",
		);
		expect(registerCall).toBeDefined();

		const validator = registerCall?.[1] as (
			request: Request,
			response: Response,
			next: NextFunction,
		) => void;

		const statusMock = vi.fn(() => ({ json: vi.fn() }));
		const response = { status: statusMock } as unknown as Response;
		const next = vi.fn();

		validator(
			{ body: { email: "not-an-email", password: "password" } } as Request,
			response,
			next,
		);

		expect(statusMock).toHaveBeenCalledWith(400);
		expect(next).not.toHaveBeenCalled();
	});

	it("returns 400 when registration payload contains extra fields", async () => {
		await import("../../src/routes/authRoutes");

		const registerCall = mockedPost.mock.calls.find(
			(call) => call[0] === "/register",
		);
		expect(registerCall).toBeDefined();

		const validator = registerCall?.[1] as (
			request: Request,
			response: Response,
			next: NextFunction,
		) => void;

		const statusMock = vi.fn(() => ({ json: vi.fn() }));
		const response = { status: statusMock } as unknown as Response;
		const next = vi.fn();

		validator(
			{
				body: {
					email: "valid@example.com",
					password: "Password1!",
					role: "admin",
				},
			} as Request,
			response,
			next,
		);

		expect(statusMock).toHaveBeenCalledWith(400);
		expect(next).not.toHaveBeenCalled();
	});

	it("passes valid registration payload to next middleware", async () => {
		await import("../../src/routes/authRoutes");

		const registerCall = mockedPost.mock.calls.find(
			(call) => call[0] === "/register",
		);
		expect(registerCall).toBeDefined();

		const validator = registerCall?.[1] as (
			request: Request,
			response: Response,
			next: NextFunction,
		) => void;

		const jsonMock = vi.fn();
		const statusMock = vi.fn(() => ({ json: jsonMock }));
		const response = { status: statusMock } as unknown as Response;
		const next = vi.fn();
		const request = {
			body: { email: "valid@example.com", password: "Password1!" },
		} as Request;

		validator(request, response, next);

		expect(statusMock).not.toHaveBeenCalled();
		expect(jsonMock).not.toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
		expect(request.body).toEqual({
			email: "valid@example.com",
			password: "Password1!",
		});
	});

	it("passes valid login payload to next middleware", async () => {
		await import("../../src/routes/authRoutes");

		const loginCall = mockedPost.mock.calls.find(
			(call) => call[0] === "/login",
		);
		expect(loginCall).toBeDefined();

		const validator = loginCall?.[1] as (
			request: Request,
			response: Response,
			next: NextFunction,
		) => void;

		const jsonMock = vi.fn();
		const statusMock = vi.fn(() => ({ json: jsonMock }));
		const response = { status: statusMock } as unknown as Response;
		const next = vi.fn();
		const request = {
			body: { email: "valid@example.com", password: "password" },
		} as Request;

		validator(request, response, next);

		expect(statusMock).not.toHaveBeenCalled();
		expect(jsonMock).not.toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
		expect(request.body).toEqual({
			email: "valid@example.com",
			password: "password",
		});
	});
});
