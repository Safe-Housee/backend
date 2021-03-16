import { saveImageIntoUser } from "../services/userService";

class FileController {
	async store(req, res) {
		try {
			const { context, id } = req.query;
			if (!context) {
				return res.status(406).send({ message: "Need to be send a context" });
			}

			const validContexts = ["usuario", "report"];
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

			return res.status(201).send({ message: "Image saved" });
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: "Internal server error" });
		}
	}
}

export default new FileController();
