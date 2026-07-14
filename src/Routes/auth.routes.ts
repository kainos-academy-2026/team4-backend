import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { validateLoginRequest } from "../middleware/login-request.middleware";
import { getPrismaClient } from "../prismaClient";
import PrismaUserRepository from "../repositories/prisma.user.repo";
import AppAuthService from "../services/auth/appAuth.service";
import ArgonPasswordService from "../services/auth/password/argonPassword.service";
import JoseTokenService from "../services/auth/token/joseToken.service";

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
