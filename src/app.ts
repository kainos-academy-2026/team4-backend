import { PrismaClient } from "@prisma/client";
import express from "express";
import { AuthController } from "./controllers/auth.controller";
import PrismaUserRepository from "./repositories/prisma.user.repo";
import { createAuthRouter } from "./routes/auth.routes";
import AppAuthService from "./services/auth/appAuth.service";
import ArgonPasswordService from "./services/auth/password/argonPassword.service";
import JoseTokenService from "./services/auth/token/joseToken.service";

const app = express();
app.disable("x-powered-by");

app.use(express.json());

// Wire up dependencies
const prisma = new PrismaClient();
const userRepository = new PrismaUserRepository(prisma);
const passwordService = new ArgonPasswordService();
const tokenService = new JoseTokenService();
const authService = new AppAuthService(
	userRepository,
	passwordService,
	tokenService,
);
const authController = new AuthController(authService);

app.use("/auth", createAuthRouter(authController));

app.get("/health", (_request, response) => {
	response.json({
		status: "UP",
		time: new Date().toISOString(),
	});
});

export default app;
