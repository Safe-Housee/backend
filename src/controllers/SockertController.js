import { v4 } from "uuid";
import { events } from "../enum/events";
import { stringToObject } from "../utils/stringToObject";

export class SocketController {
	constructor(socket) {
		console.log("Conectado");
		this.socket = socket;
		this.socket.id = v4();
		this.matches = new Map();
		console.log(`Novo socket conectado: ${this.socket.id}`);
	}

	sockets() {
		this.socket.on(events.NEW_MATCH, (socket) => {
			console.log(socket);
			const partida = stringToObject(socket);
			console.log(typeof partida);
			this.matches.set(partida.cdPartida, {
				cdPartida: partida.cdPartida,
				cdUsuarios: [partida.cdDonoPartida],
			});
			this.socket.join(partida.cdPartida);
		});

		this.socket.on(events.ENTER_MATCH, (socket) => {
			console.log("evento de entrar na partida");
			const partida = stringToObject(socket);
			console.log(socket);
			console.log(this.matches);
			this.matches.forEach((mapMatch) => {
				console.log(mapMatch);
				console.log(partida);
				if (partida.cdPartida === mapMatch.cdPartida) {
					mapMatch.cdUsuarios.push(partida.cdUsuario);
					console.log(`O usuário ${partida.cdUsuario} entrou na partida`);
					this.socket
						.to(partida.cdPartida)
						.emit(`O usuário ${partida.cdUsuario} entrou na partida`);
					console.log("evento emitido");
				}
			});
		});

		this.socket.on(events.NEW_MESSAGE, (socket) => {
			const partida = stringToObject(socket);
			console.log(partida);
			this.matches.forEach((mapMatch) => {
				if (partida.cdPartida === mapMatch.cdPartida) {
					mapMatch.cdUsuarios.forEach((cdUsuario) => {
						console.log("emitir para", cdUsuario);
					});
				}
			});
		});
	}
}
