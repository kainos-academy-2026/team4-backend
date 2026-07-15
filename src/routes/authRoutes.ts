import { Router } from "express";
import { AuthController } from "../controller/authController";
import { validateLoginRequest } from "../middleware/loginRequestMiddleware";
import { getPrismaClient } from "../prismaClient";
import PrismaUserRepository from "../repositories/prismaUserRepo";
import AppAuthService from "../services/auth/appAuthService";
import ArgonPasswordService from "../services/auth/password/argonPasswordService";
import JoseTokenService from "../services/auth/token/joseTokenService";

const prisma = getPrismaClient();
const userRepository = new PrismaUserRepository(prisma);
const passwordService = new ArgonPasswordService();
const tokenService = new JoseTokenService();
const authService = new AppAuthService(
	userRepository,
	passwordService,
	tokenService,
);
const controller = new AuthController(authService);

export const authRouter: Router = Router();

authRouter.post("/login", validateLoginRequest, (request, response) =>
	controller.login(request, response),
);
