import { statusPartida } from "../enum/statusPartida";
import {
	createMatch,
	insertUserOnMatch,
	removeUserFromMatch,
	getMatches,
	getPartida,
	getMatchesByGameId,
	getMatchesByName,
	getMatchesEmpty,
	updateStatusMatch,
} from "../services/matchService";

class MatchController {
	async create(req, res) {
		try {
			const basicInformation = {
				cd_jogo: "Código do jogo",
				nm_partida: "Nome da partida",
				dt_partida: "Data da partida",
				hr_partida: "Hora da partida",
				cd_usuario: "Código do usuário",
				ds_nivel: "nivel da partida",
			};

			for (const info of Object.keys(basicInformation)) {
				if (!req.body[info])
					return res
						.status(400)
						.json({ message: `Should send ${basicInformation[info]}` });
			}
			const partida = await createMatch(req.body);
			if (!partida) {
				return res.status(404).send({ message: "User id not found" });
			}
			return res.status(201).send({ message: "Created", partida });
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: "Internal server error" });
		}
	}

	async update(req, res) {
		try {
			const { cdPartida, cdUsuario } = req.params;
			const partida = await getPartida(cdPartida);
			if (partida.usuariosNaPartida === partida.limiteUsuarios) {
				await updateStatusMatch(cdPartida, statusPartida.FECHADA);
				return res.status(403).send({ message: "Partida cheia" });
			}
			if (partida.ds_status !== statusPartida.ABERTA) {
				return res
					.status(403)
					.send({ message: "Não é possivel entrar nessa partida" });
			}
			await insertUserOnMatch(cdPartida, cdUsuario);
			return res.status(200).send({ message: "Ok" });
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: "Internal server error" });
		}
	}

	async delete(req, res) {
		try {
			const { cdPartida, cdUsuario } = req.params;
			await removeUserFromMatch(cdPartida, cdUsuario);
			return res.status(200).send({ message: "Ok" });
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: "Internal server error" });
		}
	}

	async index(req, res) {
		try {
			const { gameId, name, empty } = req.query;
			let partidas;
			const emptyRule = empty === "true";
			if (gameId && !name) {
				partidas = await getMatchesByGameId(gameId, emptyRule);
			} else if (!gameId && name && !emptyRule) {
				partidas = await getMatchesByName(name);
			} else if (!gameId && !name && emptyRule) {
				partidas = await getMatchesEmpty();
			} else if (!gameId && !name && !emptyRule) {
				partidas = await getMatches();
			}
			return res.status(200).send({ partidas });
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: "Internal server error" });
		}
	}

	async getOne(req, res) {
		try {
			const { partidaId } = req.params;
			const partida = await getPartida(partidaId);
			return res.status(200).send(partida);
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: "Internal server error" });
		}
	}

	async updateStatus(req, res) {
		try {
			const { cdPartida, dsStatus } = req.params;
			await updateStatusMatch(cdPartida, dsStatus);
			const partida = await getPartida(cdPartida);
			return res.status(200).send({ partida });
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: "Internal server error" });
		}
	}
}

export default new MatchController();
