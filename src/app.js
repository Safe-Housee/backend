import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import serverHttp from "http";
import routes from "./routes";

const app = express();
const http = serverHttp.createServer(app);
const io = new Server(http, {
	path: "/chat",
	cors: {
		origin: "http://localhost:4200",
	},
});

app.use(express.json());
app.use(cors());
app.use(routes);

io.on("connection", (socket) => {
	console.log("conectado", socket);
	socket.on("message", (data) => {
		console.log(data);
	});
});

const port = process.env.PORT || 3333;

if (process.env.NODE_ENV !== "test") {
	http.listen(port, () => {
		console.log(`🏠 Server running on port: ${port}`);
	});
}

export default app;
