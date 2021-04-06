class ReporteController {
	async store(req, res) {
		const basicInformation = {
			cd_reportador: "código do usuário que está reportando",
			cd_reportado: "código do usuário reportado",
			ds_reporte: "descrição do motivo do reporte",
		};
		for (const info of Object.keys(basicInformation)) {
			if (!req.body[info])
				return res
					.status(400)
					.json({ message: `Should send ${basicInformation[info]}` });
		}
		return res.status(201).send("not implemented");
	}
}

export default new ReporteController();
