import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes";

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(routes);

const port = process.env.PORT || 3333;

if (process.env.NODE_ENV !== "test") {
	app.listen(port, () => {
		console.log(`🏠 Server running on port: ${port}`);
	});
}

export default app;
