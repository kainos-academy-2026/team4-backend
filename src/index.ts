import express from "express";

const app = express();
app.disable("x-powered-by");

const envPort = process.env.PORT;
const parsedPort = envPort !== undefined ? Number(envPort) : NaN;
const port = Number.isFinite(parsedPort) ? parsedPort : 3000;

app.get("/health", (_request, response) => {
	response.json({
		status: "UP",
		time: new Date().toISOString(),
	});
});

app.listen(port, () => {
	console.log(`API listening on port ${port}`);
});
