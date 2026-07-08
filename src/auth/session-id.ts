import crypto from "node:crypto";
// Generates a secure session ID
export const createSessionId = (): string =>
	crypto.randomBytes(32).toString("hex");
