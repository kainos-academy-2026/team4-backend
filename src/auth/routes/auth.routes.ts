import { Router } from "express";
import type { AuthController } from "../controllers/auth.controller";
import { verifyCsrf } from "../middleware/csrf.middleware";

/**
 * Auth route scaffold - not mounted in src/index.ts yet to avoid breaking existing code
 */
export const createAuthRouter = (controller: AuthController): Router => {
	const router = Router();

	router.post("/login", controller.login);
	router.post("/refresh", verifyCsrf, controller.refresh);
	router.post("/logout", verifyCsrf, controller.logout);

	return router;
};
