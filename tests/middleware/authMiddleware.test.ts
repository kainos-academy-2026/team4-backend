import { describe, expect, it, vi } from "vitest";
import { Role } from "../../src/Auth/role";
import { authorize } from "../../src/Middleware/authMiddleware";

const mockedVerifyAuthToken = vi.hoisted(() => vi.fn());

vi.mock("../../src/Auth/authToken", () => ({
	verifyAuthToken: mockedVerifyAuthToken,
}));

describe("auth middleware", () => {
	it("returns 401 when Authorization header is missing", async () => {
		const middleware = authorize([Role.Admin]);
		const status = vi.fn(() => response);
		const json = vi.fn();
		const response = { status, json };
		const next = vi.fn();
		const request = { headers: {} };

		await middleware(request as never, response as never, next);

		expect(status).toHaveBeenCalledWith(401);
		expect(json).toHaveBeenCalledWith({ message: "Unauthorized" });
		expect(next).not.toHaveBeenCalled();
	});

	it("returns 403 when role is valid but not allowed", async () => {
		mockedVerifyAuthToken.mockResolvedValueOnce({
			sub: "11",
			email: "user@example.com",
			role: Role.User,
		});

		const middleware = authorize([Role.Admin]);
		const status = vi.fn(() => response);
		const json = vi.fn();
		const response = { status, json };
		const next = vi.fn();
		const request = {
			headers: { authorization: "Bearer token" },
		};

		await middleware(request as never, response as never, next);

		expect(status).toHaveBeenCalledWith(403);
		expect(json).toHaveBeenCalledWith({ message: "Forbidden" });
		expect(next).not.toHaveBeenCalled();
	});

	it("calls next and sets authUser when token and role are valid", async () => {
		mockedVerifyAuthToken.mockResolvedValueOnce({
			sub: "7",
			email: "admin@example.com",
			role: Role.Admin,
		});

		const middleware = authorize([Role.Admin]);
		const status = vi.fn(() => response);
		const json = vi.fn();
		const response = { status, json };
		const next = vi.fn();
		const request: {
			headers: { authorization: string };
			authUser?: { id: string; email: string; role: Role };
		} = {
			headers: { authorization: "Bearer token" },
		};

		await middleware(request as never, response as never, next);

		expect(next).toHaveBeenCalledTimes(1);
		expect(status).not.toHaveBeenCalled();
		expect(request.authUser).toEqual({
			id: "7",
			email: "admin@example.com",
			role: Role.Admin,
		});
	});
});
