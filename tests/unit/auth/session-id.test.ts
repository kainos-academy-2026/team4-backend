import { describe, expect, it } from "vitest";
import { createSessionId } from "../../../src/auth/session-id";

describe("createSessionId", () => {
	it("returns a 64-character hex string", () => {
		const sessionId = createSessionId();

		expect(sessionId).toHaveLength(64);
		expect(sessionId).toMatch(/^[a-f0-9]{64}$/);
	});

	it("returns a new value for each call", () => {
		const first = createSessionId();
		const second = createSessionId();

		expect(first).not.toBe(second);
	});
});
