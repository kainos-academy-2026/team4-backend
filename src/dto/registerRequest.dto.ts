import { z } from "zod";

// Reusable password schema for any endpoint requiring password validation
export const passwordSchema = z
	.string()
	.min(8)
	.regex(/[a-z]/)
	.regex(/[A-Z]/)
	.regex(/[^A-Za-z0-9]/);

// Registration request validation schema
export const registerRequestSchema = z
	.object({
		email: z.string().email(),
		password: passwordSchema,
	})
	.strict();

// Type-safe DTO inferred from Zod schema
export type RegisterRequestDto = z.infer<typeof registerRequestSchema>;
