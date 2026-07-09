import { Router } from "express";
import type { AuthController } from "../controllers/auth.controller";

export const createAuthRouter = (controller: AuthController): Router => {
	const router = Router();

	router.post("/login", controller.login);
	// TODO: implement refresh and logout
	// router.post("/refresh", verifyCsrf, controller.refresh);
	// router.post("/logout", verifyCsrf, controller.logout);

	return router;
};
