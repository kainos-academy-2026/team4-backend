import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { AuthController } from "../controllers/auth.controller";
import PrismaUserRepository from "../repositories/prisma.user.repo";
import AppAuthService from "../Services/auth/appAuth.service";
import ArgonPasswordService from "../Services/auth/password/argonPassword.service";
import JoseTokenService from "../Services/auth/token/joseToken.service";

const prisma = new PrismaClient();
const userRepository = new PrismaUserRepository(prisma);
const passwordService = new ArgonPasswordService();
const tokenService = new JoseTokenService();
const authService = new AppAuthService(
	userRepository,
	passwordService,
	tokenService,
);
const controller = new AuthController(authService);

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

export const authRouter: Router = Router();

authRouter.post(
	"/login",
	(request, response, next) => {
		const parsed = loginSchema.safeParse(request.body);
		if (!parsed.success) {
			response.status(400).json({ message: "Invalid login payload" });
			return;
		}

		request.body = parsed.data;
		next();
	},
	controller.login,
);

// TODO: implement logout
