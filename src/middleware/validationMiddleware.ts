import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";

// Generic validation middleware factory - accepts any Zod schema and error message.
// Returns a ready-to-use Express middleware that validates request.body against the schema.
export const createValidationMiddleware =
	(schema: z.ZodSchema, errorMessage: string) =>
	(request: Request, response: Response, next: NextFunction): void => {
		const parsed = schema.safeParse(request.body);
		if (!parsed.success) {
			response.status(400).json({ message: errorMessage });
			return;
		}

		// Replace body with the parsed (stripped of extra fields) data
		request.body = parsed.data;
		next();
	};
