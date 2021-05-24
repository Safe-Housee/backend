import {
	criarReporte,
	getFileNames,
	getReporteInfo,
} from "../services/reporteService";
import { returnUser } from "../services/userService";

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

	async getOne(req, res) {
		try {
			const { cdReporte } = req.params;
			const reporte = await getReporteInfo(cdReporte);
			const reportador = await returnUser(reporte.cd_reportador);
			const reportado = await returnUser(reporte.cd_reportado);
			const arquivos = await getFileNames(reporte.nm_pastaArquivos);
			delete reporte.nm_pastaArquivos;
			const response = {
				cd_reporte: cdReporte,
				reportado,
				reportador,
				...reporte,
				arquivos,
			};
			return res.status(200).send(response);
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: "Internal server error" });
		}
	}
}

export default new ReporteController();
