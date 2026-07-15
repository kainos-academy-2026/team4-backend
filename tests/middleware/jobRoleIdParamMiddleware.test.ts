import { describe, expect, it, vi } from "vitest";
import { validateJobRoleIdParam } from "../../src/middleware/jobRoleIdParamMiddleware";

const makeResponse = () => {
	const json = vi.fn();
	const status = vi.fn(() => ({ json }));
	return { status, json };
};

describe("validateJobRoleIdParam", () => {
	it("calls next and preserves normalised id when valid", () => {
		const request = { params: { id: "12" } };
		const response = makeResponse();
		const next = vi.fn();

		validateJobRoleIdParam(request as never, response as never, next);

		expect(next).toHaveBeenCalled();
		expect(request.params.id).toBe("12");
		expect(response.status).not.toHaveBeenCalled();
	});

	it("returns 400 for non-numeric id", () => {
		const request = { params: { id: "abc" } };
		const response = makeResponse();
		const next = vi.fn();

		validateJobRoleIdParam(request as never, response as never, next);

		expect(response.status).toHaveBeenCalledWith(400);
		expect(response.status(400).json).toHaveBeenCalledWith({
			message: "Invalid job role id",
		});
		expect(next).not.toHaveBeenCalled();
	});

	it("returns 400 for decimal id", () => {
		const request = { params: { id: "1.5" } };
		const response = makeResponse();
		const next = vi.fn();

		validateJobRoleIdParam(request as never, response as never, next);

		expect(response.status).toHaveBeenCalledWith(400);
		expect(next).not.toHaveBeenCalled();
	});

	it("returns 400 for scientific notation id", () => {
		const request = { params: { id: "1e2" } };
		const response = makeResponse();
		const next = vi.fn();

		validateJobRoleIdParam(request as never, response as never, next);

		expect(response.status).toHaveBeenCalledWith(400);
		expect(next).not.toHaveBeenCalled();
	});

	it("returns 400 for zero", () => {
		const request = { params: { id: "0" } };
		const response = makeResponse();
		const next = vi.fn();

		validateJobRoleIdParam(request as never, response as never, next);

		expect(response.status).toHaveBeenCalledWith(400);
		expect(next).not.toHaveBeenCalled();
	});

	it("returns 400 for negative id", () => {
		const request = { params: { id: "-1" } };
		const response = makeResponse();
		const next = vi.fn();

		validateJobRoleIdParam(request as never, response as never, next);

		expect(response.status).toHaveBeenCalledWith(400);
		expect(next).not.toHaveBeenCalled();
	});

	it("returns 400 for unsafe integer", () => {
		const request = { params: { id: "9007199254740993" } };
		const response = makeResponse();
		const next = vi.fn();

		validateJobRoleIdParam(request as never, response as never, next);

		expect(response.status).toHaveBeenCalledWith(400);
		expect(next).not.toHaveBeenCalled();
	});
});
