import { adicionarHonra } from "../services/honraService";

class HonraController {
	async store(req, res) {
		const { avaliacao } = req.body;
		const { cdUsuario } = req.params;
		if (!avaliacao) {
			return res.status(400).send({ message: "Need to be send avaliacao" });
		}

		if (typeof avaliacao !== "string") {
			return res.status(403).send({ message: "Avalicao need to be a string" });
		}
		let returnInfo = null;
		switch (avaliacao) {
			case "positiva": {
				returnInfo = await adicionarHonra({ cdUsuario });
				break;
			}
			case "negativa": {
				returnInfo = await removerHonra();
				break;
			}
			default: {
				return res.status(400).send({ message: "Avaliacao inválida" });
			}
		}

		return res.status(200).send(returnInfo);
	}
}

export default new HonraController();
