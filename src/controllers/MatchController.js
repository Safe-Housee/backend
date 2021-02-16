import { createMatch } from "../services/matchService";

class MatchController {
	async create(req, res) {
		console.log(req.body);
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
}

export default new MatchController();
