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
	console.log("Conectado");
	const newSocket = webSocket;
	newSocket.id = v4();
	sockets.push(newSocket);
	console.log(`Novo socket conectado: ${socket.id}`);

	socket.on(events.NEW_MATCH, (param) => {
		console.log(param);
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
				// if (!match.sockets.includes(socket.id)) {
				// 	match.sockets.push(socket.id);
				// }
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
			});
		}

		/**
		 * TODO
		 * Refatorar para emitir o evento para todos os sockets dentro da propriedade PS: Menos o meu.
		 *
		 * Provalmente salvar o id do socket no client pode resolver o problema dos reload
		 *
		 * Quando o server/client reseta o chat se perde
		 *
		 * Ao invés de criar salas eu posso concatenar a mensagem ao código da partida assim gerando eventos unicos e n preciso de salas
		 *
		 */
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
					mapMatch.cdUsuarios.forEach((usuario) => {
						if (!usuario.isOwner) {
							usuario.socketId = socket.id;
						}
						webSocket
							.to(mapMatch.cdPartida)
							.emit(events.USER_ALREADY_ON_MATCH, socket.id, partida);
					});
					return;
				}
				mapMatch.cdUsuarios.push({
					cdUsuario: partida.cdUsuario,
					name: partida.name,
					socketId: socket.id,
					isOwner: false,
				});
				socket.join(partida.cdPartida);
				mapMatch.cdUsuarios.forEach(() => {
					webSocket
						.to(mapMatch.cdPartida)
						.emit(
							events.ENTER_MATCH,
							socket.id,
							`O usuário ${partida.cdUsuario} entrou na partida`
						);
				});
			}
		});
	});

	socket.on(events.NEW_MESSAGE, (param) => {
		const partida = param;
		matches.forEach((mapMatch) => {
			if (partida.cdPartida === mapMatch.cdPartida) {
				mapMatch.cdUsuarios.forEach((usuario) => {
					webSocket.to(usuario.socketId).emit(events.NEW_MESSAGE, partida);
				});
			}
		});
	});

	socket.on(events.LEFT_MATCH, (param) => {
		const partida = param;
		matches.forEach((mapMatch) => {
			if (partida.cdPartida === mapMatch.cdPartida) {
				console.log(matches);
				const index = mapMatch.cdUsuarios.findIndexOf(
					(cd) => partida.cdUsuario === cd
				);

				mapMatch.cdUsuarios.splice(index, 1);
				webSocket
					.to(partida.cdPartida)
					.emit(events.LEFT_MATCH, socket.id, partida);
				console.log(
					`O usuario ${partida.cdUsuario} saiu da partida ${partida.cdPartida}`
				);
				console.log(matches);
			}
		});
	});

	socket.on(events.CLOSE_MATCH, (param) => {
		const partida = param;
		matches.forEach((mapMatch, index) => {
			if (partida.cdPartida === mapMatch.cdPartida) {
				console.log(matches);
				matches.splice(index, 1);
				webSocket
					.to(partida.cdPartida)
					.emit(events.CLOSE_MATCH, socket.id, partida);
				console.log(`A partida ${partida.cdPartida} foi fechada`);
				console.log(matches);
			}
		});
	});

	socket.on(events.UPDATE_MATCH, (param) => {
		const partida = param;
		matches.forEach((mapMatch) => {
			if (partida.cdPartida === mapMatch.cdPartida) {
				webSocket
					.to(partida.cdPartida)
					.emit(events.CLOSE_MATCH, socket.id, partida);
				console.log(`A partida ${partida.cdPartida} foi atualizada`);
				console.log(matches);
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
