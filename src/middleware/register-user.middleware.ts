import { registerRequestSchema } from "../dto/registerRequest.dto";
import { createValidationMiddleware } from "./validationMiddleware";

// Registration-specific validation middleware
export const validateRegisterUser = createValidationMiddleware(
	registerRequestSchema,
	"Invalid registration payload",
);
