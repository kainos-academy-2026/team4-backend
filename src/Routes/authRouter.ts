import { Router } from "express";
import { AuthController } from "../Controller/authController";
import { AuthService } from "../Services/authService";

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;
