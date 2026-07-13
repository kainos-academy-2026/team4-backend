import "dotenv/config";
import helmet from "helmet";
import app from "./app";
import jobRoleRouter from "./Routes/jobRoleRouter";

const envPort = process.env.PORT;
const parsedPort = envPort !== undefined ? Number(envPort) : NaN;
const port = Number.isFinite(parsedPort) ? parsedPort : 3000;

app.use(helmet());

app.use(jobRoleRouter);

app.listen(port, () => {
	console.log(`API listening on port ${port}`);
});
