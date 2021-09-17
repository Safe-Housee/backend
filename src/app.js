/* eslint-disable consistent-return */
import express from "express";
import cors from "cors";
import http from "http";
import io from "socket.io";
import { v4 } from "uuid";
import routes from "./routes";
import { events } from "./enum/events";

const app = express();
const httpServer = http.Server(app);

const webSocket = io(httpServer, {
	cors: {
		origin: "*",
	},
	allowEIO3: true,
});

app.use(express.json());
app.use(cors());
app.use(routes);
const matches = [];
const sockets = [];
webSocket.on("connection", (socket) => {
	const newSocket = webSocket;
	newSocket.id = v4();
	sockets.push(newSocket);
	console.log(`Novo socket conectado: ${socket.id}`);

	socket.on(events.NEW_MATCH, (param) => {
		const partida = param;
		let insertNewMatch = true;
		matches.forEach((match) => {
			if (match.cdPartida === partida.cdPartida) {
				insertNewMatch = false;
				console.log("evento emitido");
				match.cdUsuarios.forEach((usuario) => {
					if (usuario.cdUsuario === partida.cdDonoPartida) {
						usuario.socketId = socket.id;
					}
				});

				return webSocket
					.to(partida.cdPartida)
					.emit(events.USER_ALREADY_ON_MATCH, `Partida já criada`);
			}
		});
		if (insertNewMatch) {
			matches.push({
				cdPartida: partida.cdPartida,
				cdUsuarios: [
					{
						cdUsuario: partida.cdDonoPartida,
						name: partida.name,
						socketId: socket.id,
						isOwner: true,
					},
				],
				sockets: [],
			});
		}
		socket.join(partida.cdPartida);
	});

	socket.on(events.ENTER_MATCH, (param) => {
		const partida = param;
		matches.forEach((mapMatch) => {
			if (partida.cdPartida === mapMatch.cdPartida) {
				const usuarios = mapMatch.cdUsuarios.map(
					(usuario) => usuario.cdUsuario
				);
				if (usuarios.includes(partida.cdUsuario)) {
					mapMatch.sockets.push(socket.id);
					socket.join(partida.cdPartida);
					mapMatch.cdUsuarios.forEach((usuario) => {
						webSocket
							.to(usuario.socketId)
							.emit(events.USER_ALREADY_ON_MATCH, partida);
					});
					return;
				}
				mapMatch.cdUsuarios.forEach((usuario) => {
					webSocket.to(usuario.socketId).emit(events.UPDATE_MATCH, partida);
				});
				mapMatch.cdUsuarios.push({
					cdUsuario: partida.cdUsuario,
					name: partida.name,
					socketId: socket.id,
					isOwner: false,
				});
				socket.join(partida.cdPartida);
			}
		});
	});

	socket.on(events.NEW_MESSAGE, (param) => {
		const partida = param;
		matches.forEach((mapMatch) => {
			if (partida.cdPartida === mapMatch.cdPartida) {
				// mapMatch.cdUsuarios.forEach((usuario) => {
				// 	webSocket.to(usuario.socketId).emit(events.NEW_MESSAGE, partida);
				// });
				// mapMatch.sockets.forEach((id) => {
				// 	webSocket.to(id).emit(events.NEW_MESSAGE, partida);
				// });
				webSocket.to(partida.cdPartida).emit(events.NEW_MESSAGE, partida);
			}
		});
	});

	socket.on(events.LEFT_MATCH, (param) => {
		const partida = param;
		matches.forEach((mapMatch) => {
			if (partida.cdPartida === mapMatch.cdPartida) {
				const index = mapMatch.cdUsuarios.indexOf(
					(cd) => partida.cdUsuario === cd
				);

				mapMatch.cdUsuarios.splice(index, 1);
				// mapMatch.cdUsuarios.forEach((usuario) => {
				// 	webSocket.to(usuario.socketId).emit(events.UPDATE_MATCH, partida);
				// });
				webSocket.to(partida.cdPartida).emit(events.UPDATE_MATCH, partida);
				console.log(
					`O usuario ${partida.cdUsuario} saiu da partida ${partida.cdPartida}`
				);
			}
		});
	});

	socket.on(events.CLOSE_MATCH, (param) => {
		const partida = param;
		matches.forEach((mapMatch, index) => {
			if (partida.cdPartida === mapMatch.cdPartida) {
				matches.splice(index, 1);
				webSocket
					.to(partida.cdPartida)
					.emit(events.CLOSE_MATCH, socket.id, partida);
				console.log(`A partida ${partida.cdPartida} foi fechada`);
			}
		});
	});

	socket.on(events.UPDATE_MATCH, (param) => {
		const partida = param;
		matches.forEach((mapMatch) => {
			if (partida.cdPartida === mapMatch.cdPartida) {
				// mapMatch.cdUsuarios.forEach((usuario) => {
				// 	webSocket.to(usuario.socketId).emit(events.UPDATE_MATCH, partida);
				// 	console.log(`A partida ${partida.cdPartida} foi atualizada`);
				// });
				webSocket.to(partida.cdPartida).emit(events.UPDATE_MATCH, partida);
			}
		});
	});
});

const port = process.env.PORT || 3333;

if (process.env.NODE_ENV !== "test") {
	httpServer.listen(port, () => {
		console.log(`🏠 Server running on port: ${port}`);
	});
}

export default app;
