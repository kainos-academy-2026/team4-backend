import { Router } from "express";
import { AuthController } from "../Controller/auth.controller";
import { LoginRequestSchema } from "../Dto/loginRequest.dto";
import { getPrismaClient } from "../prismaClient";
import PrismaUserRepository from "../repositories/prisma.user.repo";
import AppAuthService from "../Services/auth/appAuth.service";
import ArgonPasswordService from "../Services/auth/password/argonPassword.service";
import JoseTokenService from "../Services/auth/token/joseToken.service";

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

authRouter.post(
	"/login",
	(request, response, next) => {
		const parsed = LoginRequestSchema.safeParse(request.body);
		if (!parsed.success) {
			response.status(400).json({ message: "Invalid login payload" });
			return;
		}

		request.body = parsed.data;
		next();
	},
	(request, response) => controller.login(request, response),
);
