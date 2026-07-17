import { loginRequestSchema } from "../dto/loginRequestDto";
import { createValidationMiddleware } from "./validationMiddleware";

// Login-specific validation middleware
export const validateLoginRequest = createValidationMiddleware(
	loginRequestSchema,
	"Invalid login payload",
);
