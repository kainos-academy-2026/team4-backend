import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";
import { registerRequestSchema } from "../dto/registerRequest.dto";

// Generic validation middleware factory - accepts any Zod schema and error message
export const createValidationMiddleware =
	(schema: z.ZodSchema, errorMessage: string) =>
	(request: Request, response: Response, next: NextFunction): void => {
		const parsed = schema.safeParse(request.body);
		if (!parsed.success) {
			response.status(400).json({ message: errorMessage });
			return;
		}

		request.body = parsed.data;
		next();
	};

// Registration-specific validation middleware using generic factory
export const validateRegisterUser = createValidationMiddleware(
	registerRequestSchema,
	"Invalid registration payload",
);
