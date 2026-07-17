import { jwtVerify } from "jose";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Role } from "../../src/Auth/role";
import {
	authorize,
	optionalAuth,
	requireAuth,
} from "../../src/middleware/authMiddleware";

const mockedVerifyAuthToken = vi.hoisted(() => vi.fn());

vi.mock("../../src/Auth/authToken", () => ({
	verifyAuthToken: mockedVerifyAuthToken,
}));

vi.mock("jose", () => ({
	jwtVerify: vi.fn(),
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

const makeRequest = (authHeader?: string) => ({
	headers: {
		authorization: authHeader,
	},
	user: undefined as unknown,
});

const makeResponse = () => {
	const json = vi.fn();
	const status = vi.fn(() => ({ json }));
	return { status, json };
};

describe("requireAuth middleware", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.JWT_ACCESS_SECRET = "a".repeat(128);
	});

	it("calls next and attaches user when token is valid", async () => {
		vi.mocked(jwtVerify).mockResolvedValue({
			payload: {
				userId: "user-123",
				email: "user@example.com",
				role: "user",
			},
			protectedHeader: { alg: "HS256" },
		});

		const request = makeRequest("Bearer valid.token.here");
		const response = makeResponse();
		const next = vi.fn();

		await requireAuth(request as never, response as never, next);

		expect(next).toHaveBeenCalledWith();
		expect(request.user).toMatchObject({
			userId: "user-123",
			email: "user@example.com",
			role: "user",
		});
	});

	it("returns 401 when no Authorization header provided", async () => {
		const request = makeRequest(undefined);
		const response = makeResponse();
		const next = vi.fn();

		await requireAuth(request as never, response as never, next);

		expect(response.status).toHaveBeenCalledWith(401);
		expect(next).not.toHaveBeenCalled();
	});

	it("returns 401 when Authorization header does not start with Bearer", async () => {
		const request = makeRequest("Basic some-token");
		const response = makeResponse();
		const next = vi.fn();

		await requireAuth(request as never, response as never, next);

		expect(response.status).toHaveBeenCalledWith(401);
		expect(next).not.toHaveBeenCalled();
	});

	it("returns 401 when jwtVerify throws (invalid/expired token)", async () => {
		vi.mocked(jwtVerify).mockRejectedValue(new Error("Invalid token"));

		const request = makeRequest("Bearer bad.token");
		const response = makeResponse();
		const next = vi.fn();

		await requireAuth(request as never, response as never, next);

		expect(response.status).toHaveBeenCalledWith(401);
		expect(next).not.toHaveBeenCalled();
	});

	it("returns 500 when JWT_ACCESS_SECRET is not set", async () => {
		delete process.env.JWT_ACCESS_SECRET;

		const request = makeRequest("Bearer some.token");
		const response = makeResponse();
		const next = vi.fn();

		await requireAuth(request as never, response as never, next);

		expect(response.status).toHaveBeenCalledWith(500);
		expect(next).not.toHaveBeenCalled();
	});

	it("returns 401 when JWT payload has invalid shape", async () => {
		vi.mocked(jwtVerify).mockResolvedValue({
			payload: { sub: "missing-required-fields" },
			protectedHeader: { alg: "HS256" },
		});

		const request = makeRequest("Bearer some-token");
		const response = makeResponse();
		const next = vi.fn();

		await requireAuth(request as never, response as never, next);

		expect(response.status).toHaveBeenCalledWith(401);
		expect(next).not.toHaveBeenCalled();
	});
});

describe("optionalAuth middleware", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.JWT_ACCESS_SECRET = "a".repeat(128);
	});

	it("calls next and leaves request.user undefined when Authorization header is missing", async () => {
		const request = makeRequest(undefined);
		const response = makeResponse();
		const next = vi.fn();

		await optionalAuth(request as never, response as never, next);

		expect(next).toHaveBeenCalledWith();
		expect(jwtVerify).not.toHaveBeenCalled();
		expect(request.user).toBeUndefined();
	});

	it("calls next and leaves request.user undefined when header is not Bearer", async () => {
		const request = makeRequest("Basic not-a-bearer-token");
		const response = makeResponse();
		const next = vi.fn();

		await optionalAuth(request as never, response as never, next);

		expect(next).toHaveBeenCalledWith();
		expect(jwtVerify).not.toHaveBeenCalled();
		expect(request.user).toBeUndefined();
	});

	it("calls next and leaves request.user undefined when JWT_ACCESS_SECRET is missing", async () => {
		delete process.env.JWT_ACCESS_SECRET;

		const request = makeRequest("Bearer some.token");
		const response = makeResponse();
		const next = vi.fn();

		await optionalAuth(request as never, response as never, next);

		expect(next).toHaveBeenCalledWith();
		expect(jwtVerify).not.toHaveBeenCalled();
		expect(request.user).toBeUndefined();
	});

	it("attaches request.user when token is valid", async () => {
		vi.mocked(jwtVerify).mockResolvedValue({
			payload: {
				userId: "user-optional",
				email: "optional@example.com",
				role: "user",
			},
			protectedHeader: { alg: "HS256" },
		});

		const request = makeRequest("Bearer valid.token");
		const response = makeResponse();
		const next = vi.fn();

		await optionalAuth(request as never, response as never, next);

		expect(next).toHaveBeenCalledWith();
		expect(request.user).toMatchObject({
			userId: "user-optional",
			email: "optional@example.com",
			role: "user",
		});
	});

	it("ignores invalid payload shape and still calls next", async () => {
		vi.mocked(jwtVerify).mockResolvedValue({
			payload: { sub: "missing-fields" },
			protectedHeader: { alg: "HS256" },
		});

		const request = makeRequest("Bearer some.token");
		const response = makeResponse();
		const next = vi.fn();

		await optionalAuth(request as never, response as never, next);

		expect(next).toHaveBeenCalledWith();
		expect(request.user).toBeUndefined();
	});

	it("ignores jwtVerify errors and still calls next", async () => {
		vi.mocked(jwtVerify).mockRejectedValue(new Error("invalid token"));

		const request = makeRequest("Bearer bad.token");
		const response = makeResponse();
		const next = vi.fn();

		await optionalAuth(request as never, response as never, next);

		expect(next).toHaveBeenCalledWith();
		expect(request.user).toBeUndefined();
	});
});
