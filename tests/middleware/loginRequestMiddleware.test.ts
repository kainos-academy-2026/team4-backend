import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { validateLoginRequest } from "../../src/middleware/loginRequestMiddleware";

describe("validateLoginRequest middleware", () => {
	let response: Response;
	let next: NextFunction;
	let statusMock: ReturnType<typeof vi.fn>;
	let jsonMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		jsonMock = vi.fn();
		statusMock = vi.fn(() => ({ json: jsonMock }));
		response = { status: statusMock } as unknown as Response;
		next = vi.fn();
	});

	describe("Email Validation", () => {
		it("rejects missing email", () => {
			const request = { body: { password: "password" } } as Request;

			validateLoginRequest(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				message: "Invalid login payload",
			});
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects non-email string", () => {
			const request = {
				body: { email: "notanemail", password: "password" },
			} as Request;

			validateLoginRequest(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects empty email", () => {
			const request = {
				body: { email: "", password: "password" },
			} as Request;

			validateLoginRequest(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects null email", () => {
			const request = {
				body: { email: null, password: "password" },
			} as Request;

			validateLoginRequest(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects non-string email", () => {
			const request = {
				body: { email: 123, password: "password" },
			} as Request;

			validateLoginRequest(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});
	});

	describe("Password Validation", () => {
		it("rejects missing password", () => {
			const request = {
				body: { email: "user@example.com" },
			} as Request;

			validateLoginRequest(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects empty password", () => {
			const request = {
				body: { email: "user@example.com", password: "" },
			} as Request;

			validateLoginRequest(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				message: "Invalid login payload",
			});
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects null password", () => {
			const request = {
				body: { email: "user@example.com", password: null },
			} as Request;

			validateLoginRequest(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});
	});

	describe("Valid Payload", () => {
		it("calls next and does not set status when payload is valid", () => {
			const request = {
				body: { email: "user@example.com", password: "anypassword" },
			} as Request;

			validateLoginRequest(request, response, next);

			expect(next).toHaveBeenCalledTimes(1);
			expect(statusMock).not.toHaveBeenCalled();
		});

		it("strips extra fields from the request body", () => {
			const request = {
				body: {
					email: "user@example.com",
					password: "anypassword",
					role: "admin",
				},
			} as Request;

			validateLoginRequest(request, response, next);

			expect(next).toHaveBeenCalled();
			expect(request.body).toEqual({
				email: "user@example.com",
				password: "anypassword",
			});
		});
	});
});
