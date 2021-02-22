import { createMatch, insertUserOnMatch } from "../services/matchService";

class MatchController {
	async create(req, res) {
		try {
			const basicInformation = {
				cd_jogo: "Código do jogo",
				nm_partida: "Nome da partida",
				dt_partida: "Data da partida",
				hr_partida: "Hora da partida",
				cd_usuario: "Código do usuário",
			};

			for (const info of Object.keys(basicInformation)) {
				if (!req.body[info])
					return res
						.status(400)
						.json({ message: `Should send ${basicInformation[info]}` });
			}
			await createMatch(req.body);
			return res.status(201).send({ message: "Created" });
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: "Internal server error" });
		}
	}

	async update(req, res) {
		try {
			const { cdPartida, cdUsuario } = req.params;
			await insertUserOnMatch(cdPartida, cdUsuario);
			return res.status(200).send({ message: "Ok" });
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: "Internal server error" });
		}
	}
}

export default new MatchController();
