import { z } from "zod";

export const AuthPayloadSchema = z.object({
	userId: z.string(),
	email: z.string().email(),
	role: z.string(),
});

export type AuthPayloadDto = z.infer<typeof AuthPayloadSchema>;
