class HonraController {
	async store(req, res) {
		const { avaliacao } = req.body;
		if (!avaliacao) {
			return res.status(400).send({ message: "Need to be send avaliacao" });
		}

		if (typeof avaliacao !== "string") {
			return res.status(403).send({ message: "Avalicao need to be a string" });
		}
		return res.send({ message: "not implement" });
	}
}

export default new HonraController();
