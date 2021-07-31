import { contextDestinations } from "../enum/contextDestination";
import { saveImageIntoUser } from "../services/userService";
import { saveImageIntoReporte } from "../services/reporteService";

class FileController {
	async store(req, res) {
		try {
			const { context, id } = req.query;
			if (!context) {
				return res.status(406).send({ message: "Need to be send a context" });
			}

			const validContexts = Object.keys(contextDestinations);
			if (!validContexts.includes(context)) {
				return res.status(404).send({ message: "This context not exists" });
			}
			if (!id) {
				return res
					.status(406)
					.send({ message: "Need to send a id to identify" });
			}
			const { filename } = req.file;
			if (context === "usuario") await saveImageIntoUser(filename, id);
			if (context === "report") await saveImageIntoReporte(filename, id);

			return res.status(201).send({ message: "Image saved" });
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: "Internal server error" });
		}
	}
}

export default new FileController();
