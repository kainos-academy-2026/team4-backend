import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const passwordSchema = z
	.string()
	.min(8)
	.regex(/[a-z]/)
	.regex(/[A-Z]/)
	.regex(/[^A-Za-z0-9]/);

const registerUserSchema = z
	.object({
		email: z.string().email(),
		password: passwordSchema,
	})
	.strict();

export const validateRegisterUser = (
	request: Request,
	response: Response,
	next: NextFunction,
): void => {
	const parsed = registerUserSchema.safeParse(request.body);
	if (!parsed.success) {
		response.status(400).json({ message: "Invalid registration payload" });
		return;
	}

	request.body = parsed.data;
	next();
};
