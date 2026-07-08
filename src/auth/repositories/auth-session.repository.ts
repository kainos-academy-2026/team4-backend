import type { SessionRecord } from "../types";

export type UpsertSessionInput = {
	userId: string;
	sessionId: string;
	refreshTokenHash: string;
	expiresAt: Date;
	ipAddress?: string;
};
/**
 * Prisma-backed repository contract.
 * TODO: implement with Prisma once DB is created
 */
export interface AuthSessionRepository {
	upsertSingleDeviceSession(input: UpsertSessionInput): Promise<SessionRecord>;
	findByUserId(userId: string): Promise<SessionRecord | null>;
	findBySessionId(sessionId: string): Promise<SessionRecord | null>;
	revokeSessionBySessionId(sessionId: string): Promise<void>;
}
