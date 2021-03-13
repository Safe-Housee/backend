class FileController {
	async store(req, res) {
		try {
			const { context } = req.params;
			if (!context)
				return res.status(406).send({ message: "Need to be send a context" });
			const { filename: path, originalname: name } = req.file;
			console.log("file", path, name);

			return res.json();
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: "Internal server error" });
		}
	}
}

export default new FileController();
