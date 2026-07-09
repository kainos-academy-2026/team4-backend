import "dotenv/config";
import express from "express";
import helmet from "helmet";
import jobRoleRouter from "./Routes/jobRoleRouter";

const app = express();

const envPort = process.env.PORT;
const parsedPort = envPort !== undefined ? Number(envPort) : NaN;
const port = Number.isFinite(parsedPort) ? parsedPort : 3000;

app.use(helmet());

app.get("/health", (_request, response) => {
	response.json({
		status: "UP",
		time: new Date().toISOString(),
	});
});

app.use(jobRoleRouter);

app.listen(port, () => {
	console.log(`API listening on port ${port}`);
});
