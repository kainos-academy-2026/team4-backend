import "dotenv/config";
import app from "./app";
import jobRoleRouter from "./routes/jobRoleRouter";

const envPort = process.env.PORT;
const parsedPort = envPort !== undefined ? Number(envPort) : NaN;
const port = Number.isFinite(parsedPort) ? parsedPort : 3000;

app.use(jobRoleRouter);

app.listen(port, () => {
	console.log(`API listening on port ${port}`);
});
