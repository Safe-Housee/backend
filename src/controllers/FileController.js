class FileController {
	async store(req, res) {
		try {
			const { context } = req.query;
			if (!context)
				return res.status(406).send({ message: "Need to be send a context" });

			if (!Object.keys(req.body).length)
				return res
					.status(406)
					.send({ message: "Need to send a body to identify" });

			return res.json();
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: "Internal server error" });
		}
	}
}

export default new FileController();
