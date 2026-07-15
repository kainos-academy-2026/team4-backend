import "dotenv/config";
import app from "./app";
import jobRoleRouter from "./routes/jobRoleRouter";

const port = Number(process.env.PORT) || 4000;

app.use(jobRoleRouter);

app.listen(port, () => {
	console.log(`API listening on port ${port}`);
});
