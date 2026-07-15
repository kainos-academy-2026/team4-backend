import express from "express";
import helmet from "helmet";
import { authRouter } from "./routes/authRoutes";
import jobRoleRouter from "./routes/jobRoleRouter";

const app = express();
app.disable("x-powered-by");

app.use(helmet());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/", jobRoleRouter);

app.get("/health", (_request, response) => {
	response.json({
		status: "UP",
		time: new Date().toISOString(),
	});
});

export default app;
