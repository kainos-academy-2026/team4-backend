import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { validateRegisterUser } from "../../src/middleware/register-user.middleware";

describe("validateRegisterUser middleware", () => {
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
		it("rejects missing email field", () => {
			const request = { body: { password: "Password1!" } } as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects null email", () => {
			const request = {
				body: { email: null, password: "Password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects undefined email", () => {
			const request = {
				body: { email: undefined, password: "Password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects empty email string", () => {
			const request = {
				body: { email: "", password: "Password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects email without @", () => {
			const request = {
				body: { email: "notanemail.com", password: "Password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects email without domain", () => {
			const request = {
				body: { email: "user@", password: "Password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects email without local part", () => {
			const request = {
				body: { email: "@example.com", password: "Password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects non-string email", () => {
			const request = {
				body: { email: 123, password: "Password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects email with spaces", () => {
			const request = {
				body: { email: "user @example.com", password: "Password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("accepts valid email format", () => {
			const request = {
				body: { email: "user@example.com", password: "Password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalled();
		});

		it("accepts valid email with subdomain", () => {
			const request = {
				body: { email: "user@mail.example.com", password: "Password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalled();
		});

		it("accepts valid email with +", () => {
			const request = {
				body: { email: "user+tag@example.com", password: "Password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalled();
		});
	});

	describe("Password Validation - Length", () => {
		it("rejects missing password field", () => {
			const request = { body: { email: "user@example.com" } } as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects null password", () => {
			const request = {
				body: { email: "user@example.com", password: null },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects undefined password", () => {
			const request = {
				body: { email: "user@example.com", password: undefined },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects empty password", () => {
			const request = {
				body: { email: "user@example.com", password: "" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects password with 7 characters (below minimum)", () => {
			const request = {
				body: { email: "user@example.com", password: "Pass1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("accepts password with exactly 8 characters", () => {
			const request = {
				body: { email: "user@example.com", password: "Pass1!ab" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalled();
		});

		it("accepts password with more than 8 characters", () => {
			const request = {
				body: { email: "user@example.com", password: "Password1!longpassword" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalled();
		});

		it("rejects non-string password", () => {
			const request = {
				body: { email: "user@example.com", password: 12345 },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});
	});

	describe("Password Validation - Uppercase Requirement", () => {
		it("rejects password without uppercase letter", () => {
			const request = {
				body: { email: "user@example.com", password: "password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("accepts password with single uppercase letter", () => {
			const request = {
				body: { email: "user@example.com", password: "Password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalled();
		});

		it("accepts password with multiple uppercase letters", () => {
			const request = {
				body: { email: "user@example.com", password: "PASSword1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalled();
		});

		it("rejects password with only uppercase (no lowercase)", () => {
			const request = {
				body: { email: "user@example.com", password: "PASSWORD1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});
	});

	describe("Password Validation - Lowercase Requirement", () => {
		it("rejects password without lowercase letter", () => {
			const request = {
				body: { email: "user@example.com", password: "PASSWORD1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("accepts password with single lowercase letter", () => {
			const request = {
				body: { email: "user@example.com", password: "Password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalled();
		});

		it("accepts password with multiple lowercase letters", () => {
			const request = {
				body: { email: "user@example.com", password: "Passworddd1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalled();
		});

		it("rejects password with only lowercase (no uppercase)", () => {
			const request = {
				body: { email: "user@example.com", password: "password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});
	});

	describe("Password Validation - Special Character Requirement", () => {
		it("rejects password without special character", () => {
			const request = {
				body: { email: "user@example.com", password: "Password1" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("accepts password with single special character", () => {
			const request = {
				body: { email: "user@example.com", password: "Password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalled();
		});

		it("accepts password with multiple special characters", () => {
			const request = {
				body: { email: "user@example.com", password: "Password1!@#" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalled();
		});

		it("rejects password with only alphanumeric (no special char)", () => {
			const request = {
				body: { email: "user@example.com", password: "Password123" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("accepts password with hyphen as special character", () => {
			const request = {
				body: { email: "user@example.com", password: "Password1-" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalled();
		});

		it("accepts password with underscore as special character", () => {
			const request = {
				body: { email: "user@example.com", password: "Password1_" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalled();
		});

		it("accepts password with space as special character", () => {
			const request = {
				body: { email: "user@example.com", password: "Password1 " },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalled();
		});
	});

	describe("Payload Structure Validation", () => {
		it("rejects payload with extra fields", () => {
			const request = {
				body: {
					email: "user@example.com",
					password: "Password1!",
					role: "admin",
				},
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects payload with multiple extra fields", () => {
			const request = {
				body: {
					email: "user@example.com",
					password: "Password1!",
					role: "admin",
					name: "John",
				},
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("accepts payload with exactly email and password", () => {
			const request = {
				body: { email: "user@example.com", password: "Password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalled();
		});

		it("passes validated data to request.body", () => {
			const request = {
				body: { email: "user@example.com", password: "Password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(request.body).toEqual({
				email: "user@example.com",
				password: "Password1!",
			});
		});
	});

	describe("Combined Edge Cases", () => {
		it("rejects when email is invalid AND password is too short", () => {
			const request = {
				body: { email: "invalid-email", password: "Pass1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects when email is valid BUT password lacks uppercase", () => {
			const request = {
				body: { email: "user@example.com", password: "password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects when email is valid BUT password lacks lowercase", () => {
			const request = {
				body: { email: "user@example.com", password: "PASSWORD1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("rejects when email is valid BUT password lacks special character", () => {
			const request = {
				body: { email: "user@example.com", password: "Password123" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(next).not.toHaveBeenCalled();
		});

		it("accepts when both email and password are fully valid", () => {
			const request = {
				body: { email: "user@example.com", password: "Password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalled();
		});
	});

	describe("Response Format", () => {
		it("returns 400 status code with consistent error message", () => {
			const request = {
				body: { email: "invalid", password: "bad" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				message: "Invalid registration payload",
			});
		});

		it("does not call next when validation fails", () => {
			const request = {
				body: { email: "invalid", password: "bad" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(next).not.toHaveBeenCalled();
		});

		it("calls next without response when validation passes", () => {
			const request = {
				body: { email: "user@example.com", password: "Password1!" },
			} as Request;

			validateRegisterUser(request, response, next);

			expect(response.status).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalled();
		});
	});
});
