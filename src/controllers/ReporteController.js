import { criarReporte } from "../services/reporteService";

class ReporteController {
	async store(req, res) {
		try {
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
			const reporteId = await criarReporte(req.body);
			const response = { ...req.body, cd_reporte: reporteId };
			return res.status(201).send(response);
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: "Internal server error" });
		}
	}
}

export default new ReporteController();
