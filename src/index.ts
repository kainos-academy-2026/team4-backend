import express from "express";

const app = express();
app.disable("x-powered-by");

const port = process.env.PORT || 3000;

app.get("/health", (_request, response) => {
	response.json({
		status: "UP",
		time: new Date().toISOString(),
	});
});

app.listen(port, () => {
	console.log(`API listening on port ${port}`);
});
