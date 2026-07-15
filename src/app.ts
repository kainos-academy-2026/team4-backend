import express from "express";
import helmet from "helmet";
import { Role } from "./Auth/role";
import { authorize } from "./Middleware/authMiddleware";
import authRouter from "./Routes/authRouter";
import jobRoleRouter from "./Routes/jobRoleRouter";

const app = express();

app.use(helmet());
app.use(express.json());

app.get("/health", (_request, response) => {
	response.json({
		status: "UP",
		time: new Date().toISOString(),
	});
});

app.use(authRouter);
app.use(authorize([Role.Admin, Role.User]));
app.use(jobRoleRouter);

export default app;
