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
		const machtesId = matches.map((match) => match.cdPartida);
		if (machtesId.includes(partida.cdPartida)) {
			console.log("evento emitido");
			return webSocket
				.to(socket.id)
				.emit(events.USER_ALREADY_ON_MATCH, `Partida já criada`);
		}
		matches.push({
			cdPartida: partida.cdPartida,
			cdUsuarios: [{ cdUsuario: partida.cdDonoPartida, name: partida.name }],
			sockets: [socket.id],
		});
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
		console.log(
			`Partida do id ${partida.cdPartida} com dono ${partida.cdDonoPartida}`
		);
		console.log(matches);
	});

	socket.on(events.ENTER_MATCH, (param) => {
		const partida = param;
		matches.forEach((mapMatch) => {
			if (partida.cdPartida === mapMatch.cdPartida) {
				const usuarios = mapMatch.cdUsuarios.map(
					(usuario) => usuario.cdUsuario
				);
				if (usuarios.includes(partida.cdUsuario)) {
					mapMatch.sockets.forEach((id) => {
						webSocket
							.to(id)
							.emit(events.USER_ALREADY_ON_MATCH, socket.id, partida);
					});
					return;
				}
				mapMatch.cdUsuarios.push({
					cdUsuario: partida.cdUsuario,
					name: partida.name,
				});
				mapMatch.sockets.push(socket.id);
				socket.join(partida.cdPartida);
				mapMatch.sockets.forEach((id) => {
					webSocket
						.to(id)
						.emit(
							events.ENTER_MATCH,
							socket.id,
							`O usuário ${partida.cdUsuario} entrou na partida`
						);
				});

				console.log(
					`O usuario ${partida.cdUsuario} entrou na partida ${partida.cdPartida}`
				);
				console.log(matches);
			}
		});
	});

	socket.on(events.NEW_MESSAGE, (param) => {
		const partida = param;
		matches.forEach((mapMatch) => {
			if (partida.cdPartida === mapMatch.cdPartida) {
				mapMatch.sockets.forEach((id) => {
					webSocket.to(id).emit(events.NEW_MESSAGE, partida);
				});
				console.log(
					`O usuario ${partida.cdUsuario} enviou a mensagem ${partida.message} na partida ${partida.cdPartida}`
				);
				console.log(matches);
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
