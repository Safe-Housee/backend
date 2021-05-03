class ReporteController {
	async store(req, res) {
		const basicInformation = {
			nm_reportador: "o nome do usuário que está reportando",
			nm_reportado: "o nome do usuário reportado",
			ds_reporte: "a descrição do motivo do reporte",
		};
		for (const info of Object.keys(basicInformation)) {
			if (!req.body[info])
				return res
					.status(400)
					.json({ message: `Deve enviar ${basicInformation[info]}` });
		}
		return res.status(201).send("not implemented");
	}
}

export default new ReporteController();
