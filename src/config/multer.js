import multer from "multer";
import crypto from "crypto";
import fs from "fs";
import { extname, resolve } from "path";
import { contextDestinations } from "../enum/contextDestination";
import { getReporteInfo } from "../services/reporteService";

export default {
	storage: multer.diskStorage({
		destination: async (req, _, cb) => {
			let destination = null;
			const { context, id } = req.query;

			if (context === "report") {
				const { nm_pastaArquivos } = await getReporteInfo(id);

				destination = `${contextDestinations[context]}/${process.env.NODE_ENV}-${nm_pastaArquivos}`;

				const dir = resolve(
					__dirname,
					"..",
					"..",
					"files",
					"uploads",
					destination
				);

				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir);
				}
			} else {
				destination = contextDestinations[context];
			}
			return cb(
				null,
				resolve(__dirname, "..", "..", "files", "uploads", destination)
			);
		},

		filename: (req, file, cb) => {
			crypto.randomBytes(16, (err, res) => {
				if (err) return cb(err);

				return cb(
					null,
					`${process.env.NODE_ENV}-${req.query.context}-${res.toString(
						"hex"
					)}${extname(file.originalname)}`
				);
			});
		},
	}),
};
